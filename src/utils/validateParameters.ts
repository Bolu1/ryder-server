import { info } from "console";

exports.validateParameters = (expectedParameters, actualParameters) =>{
  const messages: string[] = [];
  let isValid = true;

  expectedParameters.forEach((parameter) => {
    const actualParameter = actualParameters[parameter];

    if (
      actualParameter === null ||
      actualParameter === undefined ||
      actualParameter === ""
    ) {
      messages.push(`${parameter} is required`);
      isValid = false;
    }
  });
  return { isValid, messages };
}

exports.validateItems = (parameters)=> {
  let isValid:boolean = true;

  parameters.find((i)=>{
    if(typeof i.Description !== 'string'){
      isValid = false
      console.log("eww")
      return
    }
    if(typeof i.Quantity !== 'number'){
      console.log(typeof i.Quantity)
      console.log("ioww")
      isValid = false
      return
    }
  })
  return isValid;
}

exports.validateItemsUpdate = (parameters)=> {
  let isValid:boolean = true;

  parameters.find((i)=>{
    if(typeof i.description !== 'string'){
      isValid = false
      console.log("eww")
      return
    }
    if(typeof i.Quantity !== 'number'){
      console.log(typeof i.quantity)
      console.log("ioww")
      isValid = false
      return
    }
  })
  return isValid;
}

exports.validateItemsInvoice = (parameters)=> {
  let isValid:boolean = true;
  let totalPrice = 0
  parameters.find((i)=>{
    if(typeof i.Description !== 'string'){
      console.log(typeof i.Description)
      isValid = false
      return
    }
    if(typeof i.Quantity !== 'number'){
      console.log(typeof i.Quantity)
      isValid = false
      return
    }
    if(typeof i.Price !== 'number'){
      console.log("aa ",typeof i.Price)
      isValid = false
      return
    }
    var buffer = i.Quantity * i.Price
    totalPrice = buffer+ totalPrice
  })
  return {isValid, totalPrice};
}

// only diffrence between op and bottom is caps on some of the object keys

exports.validateItemsInvoiceFormPo = (parameters)=> {
  let isValid:boolean = true;
  let totalPrice = 0
  parameters.find((i)=>{
    if(typeof i.description !== 'string'){
      console.log(typeof i.Description)
      isValid = false
      return
    }
    if(typeof i.quantity !== 'number'){
      console.log(typeof i.Quantity)
      isValid = false
      return
    }
    if(typeof i.price !== 'number'){
      console.log("aa ",typeof i.Price)
      isValid = false
      return
    }
    var buffer = i.quantity * i.price
    totalPrice = buffer+ totalPrice
  })
  return {isValid, totalPrice};
}

