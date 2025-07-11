// composables/useDateInput.ts

export const getMaxDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate(); 
  };
  
export const useDateInput = (form: any,dateNumeration: Array<number> = [0,1,2],keyName: string = 'dateOfBirth') => {
    const onDateInput = () => {
      let value = form[keyName];
      let dateArray: Array<string> = `${value}`.split('/');
      
      let year = dateArray[dateNumeration[0]];
      let month = dateArray[dateNumeration[1]];
      let day = dateArray[dateNumeration[2]];
      
      if (month && month.length === 2 && Number(month) > 12) dateArray[1] = '12';
  
      if (month && year && year.toString().length === 4) {
        const maxDays = getMaxDaysInMonth(Number(year), Number(month));
        if (day && Number(day) > maxDays) dateArray[dateNumeration[2]] = String(maxDays);
      }
  
      form[keyName] = dateArray.join('/');
    };
  
    return {
      onDateInput,
    };
  };
  