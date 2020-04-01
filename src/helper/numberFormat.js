export const IDR = (num) => {
  let number = Number(num)
  return 'Rp. ' + number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
};