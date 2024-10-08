export interface IRow {
  cells: ICell[]
}

export interface ICell {
  type: "TEXT" | "NUMBER" | "DATE" | "TIME" | "DATETIME" | "RADIO" | "SELECT" | "CHECKBOX",
  value?: string | boolean | any,
  readonly?: boolean,
  style?: ICellStyle,
  options?: ICellOptions[],
  format?: string
}

export interface ICellStyle {
  bgColor?: string,
  color?: string,
  classes?: string
}

export interface ICellOptions {
  value: string,
  label: string
}

export interface IHeaderCell {
  label?: string | undefined,
  field: string;
  type?: string;
  options?: Array<any>;
  sorting?: boolean,
  height?: number,
  width?: number,
  func?: () => any
}
