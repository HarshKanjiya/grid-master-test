export interface IRow {
  cells: ICell[]
}

export interface ICell {
  type: "TEXT" | "NUMBER" | "DATE" | "TIME" | "DATETIME" | "RADIO" | "SELECT",
  value?: string,
  readonly?: boolean,
  style?: ICellStyle,
  options?: ICellOptions[],
  format?: string
}

export interface ICellStyle {
  fontWeight?: number,
  bgColor?: string,
  color?: string,
  italic?: boolean,
  textAlign?: "LEFT" | "CENTER" | "RIGHT",
  textDecoration?: "NONE" | "UNDERLINE" | "OVERLINE" | "LINETHROUGH"
}

export interface ICellOptions {
  value: string,
  label: string
}

export interface IHeaderCell {
  label: string,
  sorting: boolean,
  func: () => any
}
