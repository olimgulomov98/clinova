type ValidatorRule = unknown;
type ValidatorCallback = (error?: Error) => void;
export const useValidators = () => {
  function phoneNumberValidator(rule: ValidatorRule, value: string, callback: ValidatorCallback) {
    if (!value || value.replace(/\D/g, "").length !== 12) {
      callback(new Error(" "));
    } else {
      callback();
    }
  }
  function arrayElementValidator(rule: ValidatorRule, value: string, callback: ValidatorCallback) {
    if (!value || value.length === 0 || (value.length === 1 && value[0] === "")) {
      callback(new Error("Fayllar tanlanishi kerak"));
    } else {
      callback();
    }
  }
  return {
    phoneNumberValidator,
    arrayElementValidator
  };
};
