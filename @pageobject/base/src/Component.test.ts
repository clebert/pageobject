import {Adapter, Component, Effect, Operator} from '.';

class TestAdapter implements Adapter<HTMLElement> {
  public async findElements(
    selector: string,
    parent?: HTMLElement
  ): Promise<HTMLElement[]> {
    return Array.from((parent || document).querySelectorAll(selector));
  }
}

abstract class TestComponent extends Component<HTMLElement> {
  public readonly type = this.constructor.name;

  public getID(): Effect<string> {
    const trigger = async () => (await this.findElement()).id;

    return {context: this, description: 'getID()', trigger};
  }

  public getText(): Effect<string | null> {
    const trigger = async () => (await this.findElement()).textContent;

    return {context: this, description: 'getText()', trigger};
  }

  public getType(): Effect<string> {
    const trigger = async () => this.type;

    return {context: this, description: 'getType()', trigger};
  }
}

class Descriptor<TComponent extends TestComponent> {
  public readonly component: TComponent;
  public readonly description: string;
  public readonly id: string;

  public constructor(
    component: TComponent,
    description: string,
    parentDescriptor: Descriptor<TComponent> | undefined,
    position?: number
  ) {
    const {type} = (this.component = component);

    this.description = parentDescriptor
      ? `${parentDescriptor.description}.select(${type})${description}`
      : `${type}${description}`;

    this.id = `${type}${position || 0}`;
  }
}

class A extends TestComponent {
  public readonly selector: string = '.a';
}

class B extends TestComponent {
  public readonly selector: string = '.b';
}

function describeExistingVariants<TComponent extends TestComponent>(
  component: TComponent,
  parentDescriptor: Descriptor<TComponent> | undefined,
  position: number
): Descriptor<TComponent>[] {
  const id = `${component.type}${position}`;

  return [
    new Descriptor(
      component.nth(position),
      `.nth(${position})`,
      parentDescriptor,
      position
    ),
    new Descriptor(
      component.where(self => self.getID(), Operator.equals(id)),
      `.where((getID() == '${id}'))`,
      parentDescriptor,
      position
    ),
    new Descriptor(
      component.nth(1).where(self => self.getID(), Operator.equals(id)),
      `.nth(1).where((getID() == '${id}'))`,
      parentDescriptor,
      position
    ),
    new Descriptor(
      component.where(self => self.getID(), Operator.equals(id)).nth(1),
      `.nth(1).where((getID() == '${id}'))`,
      parentDescriptor,
      position
    )
  ];
}

function describeAmbiguousVariants<TComponent extends TestComponent>(
  component: TComponent,
  parentDescriptor: Descriptor<TComponent> | undefined
): Descriptor<TComponent>[] {
  return [
    new Descriptor(component, '', parentDescriptor),
    new Descriptor(
      component
        .where(self => self.getElementCount(), Operator.equals(1))
        .where(self => self.getType(), Operator.equals(component.type)),
      `.where((getElementCount() == 1), (getType() == '${component.type}'))`,
      parentDescriptor
    )
  ];
}

function describeNonExistingVariants<TComponent extends TestComponent>(
  component: TComponent,
  parentDescriptor: Descriptor<TComponent> | undefined
): Descriptor<TComponent>[] {
  return [
    new Descriptor(component.nth(3), '.nth(3)', parentDescriptor),
    new Descriptor(
      component
        .where(self => self.getElementCount(), Operator.equals(0))
        .where(self => self.getType(), Operator.equals(component.type)),
      `.where((getElementCount() == 0), (getType() == '${component.type}'))`,
      parentDescriptor
    ),
    new Descriptor(
      component
        .where(self => self.getElementCount(), Operator.equals(1))
        .where(self => self.getType(), Operator.equals('C')),
      ".where((getElementCount() == 1), (getType() == 'C'))",
      parentDescriptor
    )
  ];
}

function describeErroneousTests<TComponent extends TestComponent>(
  component: TComponent,
  parentDescriptor: Descriptor<TComponent> | undefined,
  ambiguous: boolean
): void {
  const descriptors = ambiguous
    ? describeAmbiguousVariants(component, parentDescriptor)
    : describeNonExistingVariants(component, parentDescriptor);

  for (const descriptor of descriptors) {
    const error = ambiguous ? 'Element not unique' : 'Element not found';

    describe(descriptor.description, () => {
      it('should have a description', () => {
        expect(descriptor.component.description).toBe(descriptor.description);
      });

      describe('getElementCount() => Effect.trigger()', () => {
        const effect = descriptor.component.getElementCount();

        it('should return the element count', async () => {
          await expect(effect.trigger()).resolves.toBe(ambiguous ? 2 : 0);
        });
      });
    });

    if (!parentDescriptor) {
      const b = descriptor.component.select(B);

      describe(`${descriptor.description}.select(B)`, () => {
        it('should have a description', () => {
          expect(b.description).toBe(`${descriptor.description}.select(B)`);
        });

        describe('getElementCount() => Effect.trigger()', () => {
          const effect = b.getElementCount();

          it('should throw an error', async () => {
            await expect(effect.trigger()).rejects.toThrow(error);
          });
        });
      });
    }
  }
}

function describeTests<TComponent extends TestComponent>(
  component: TComponent,
  parentDescriptor: Descriptor<TComponent> | undefined,
  position: number
): void {
  const descriptors = describeExistingVariants(
    component,
    parentDescriptor,
    position
  );

  for (const descriptor of descriptors) {
    describe(descriptor.description, () => {
      it('should have a description', () => {
        expect(descriptor.component.description).toBe(descriptor.description);
      });

      describe('nth()', () => {
        it('should throw an argument error', () => {
          expect(() => descriptor.component.nth(0)).toThrow(
            'Position must be one-based'
          );
        });

        it('should throw a state error', () => {
          expect(() => descriptor.component.nth(1).nth(2)).toThrow(
            'Position is already set'
          );
        });
      });

      describe('getElementCount() => Effect', () => {
        const effect = descriptor.component.getElementCount();

        it('should have a context', () => {
          expect(effect.context).toBe(descriptor.component);
        });

        it('should have a description', () => {
          expect(effect.description).toBe('getElementCount()');
        });

        describe('trigger()', () => {
          it('should return the element count', async () => {
            await expect(effect.trigger()).resolves.toBe(1);
          });
        });
      });

      describe('getText() => Effect.trigger()', () => {
        const effect = descriptor.component.getText();

        it('should return the text of the element', async () => {
          if (!parentDescriptor) {
            if (position === 1) {
              await expect(effect.trigger()).resolves.toContain('1');
              await expect(effect.trigger()).resolves.toContain('2');
              await expect(effect.trigger()).resolves.not.toContain('3');
            } else {
              await expect(effect.trigger()).resolves.not.toContain('1');
              await expect(effect.trigger()).resolves.not.toContain('2');
              await expect(effect.trigger()).resolves.toContain('3');
            }
          } else {
            if (position === 1) {
              await expect(effect.trigger()).resolves.toContain('1');
              await expect(effect.trigger()).resolves.not.toContain('2');
              await expect(effect.trigger()).resolves.not.toContain('3');
            } else {
              await expect(effect.trigger()).resolves.not.toContain('1');
              await expect(effect.trigger()).resolves.toContain('2');
              await expect(effect.trigger()).resolves.not.toContain('3');
            }
          }
        });
      });
    });
  }

  describeErroneousTests(component, parentDescriptor, true);
  describeErroneousTests(component, parentDescriptor, false);

  if (!parentDescriptor) {
    if (position === 1) {
      for (const descriptor of descriptors) {
        const b = descriptor.component.select(B);

        describeTests(b, descriptor, 1);
        describeTests(b, descriptor, 2);
      }
    }
  }
}

describe('Component', () => {
  document.body.innerHTML = `
    <div class="a" id="A1">
      <div class="b" id="B1">1</div>
      <div class="b" id="B2">2</div>
    </div>
    <div class="a" id="A2">3</div>
  `;

  const a = new A(new TestAdapter());

  describeTests(a, undefined, 1);
  describeTests(a, undefined, 2);
});
