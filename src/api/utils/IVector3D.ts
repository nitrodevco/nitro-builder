export interface IVector3D
{
    negate(): void;
    add(vector: IVector3D): void;
    subtract(vector: IVector3D): void;
    multiply(amount: number): void;
    divide(amount: number): void;
    assign(vector: IVector3D): void;
    normalize(): void;
    x: number;
    y: number;
    z: number;
    length: number;
}
