export abstract class MockModel<T> {
  protected abstract animalModelStub: T;

  constructor(createData: T) {
    this.constructorSpy(createData);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  constructorSpy(_createData: T): void {}

  findOne(): { exec: () => T } {
    return {
      exec: (): T => this.animalModelStub,
    };
  }

  async find(): Promise<T[]> {
    return [this.animalModelStub];
  }

  async save(): Promise<T> {
    return this.animalModelStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.animalModelStub;
  }
}
