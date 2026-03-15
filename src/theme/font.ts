export type fontOptionsType = 'FiraSans' | 'Poppins'

export const fontOptions: {
  [key: string]: {
    displayName: string
    value: fontOptionsType
  }
} = {
  firaSans: { displayName: 'Fira Sans', value: 'FiraSans' },
  poppins: { displayName: 'Poppins', value: 'Poppins' },
}
