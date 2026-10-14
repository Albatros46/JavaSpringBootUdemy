const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
const dateTime = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })

export const formatPrice = (value: number) => currency.format(value)

export const formatDate = (value?: string) => (value ? dateTime.format(new Date(value)) : '-')

export const errorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu')
