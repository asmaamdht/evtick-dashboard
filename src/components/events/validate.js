
export default function validate(form, categories, rows) {
     let e={};
//  const [errors, setErrors] = useState({});

// if (!form.venueId) {
//   e.address = "Choose venue first";
//   e.totalTickets = "Choose venue first";
//   e.priceA = "Choose venue first";
// }
if (form.mode === "offline" && !form.venueId) {
   e.totalTickets = "Choose venue first";
  e.priceA = "Choose venue first";
}


//event name
    if (!form.eventName || !form.eventName.trim()) {
    e.eventName = "Required";
  } else if (/^\d+$/.test(form.eventName.trim())) {
    e.eventName = "Cannot be only numbers";
  }

  // Type
  if 
  (!form.type || !form.type.trim()) {
  e.type = "Required";
} 
// else if (!/^[A-Za-z\s]+$/.test(form.type)) {
//   e.type = "Only letters allowed";
// } 
else if (!categories.includes(form.type)) {
  e.type = "Please choose a category from the list";
}

    
  //address
  if (!form.address || !form.address.trim()) {
    e.address = "Required";
  } else if (/^\d+$/.test(form.address.trim())) {
    e.address = "Cannot be only numbers";
  }


    if(!form.date) e.date="Required";
    if(!form.time) e.time="Required";
    
 // Total tickets
  if (!form.totalTickets || form.totalTickets === "") {
  e.totalTickets = "Required";
} else {
  const value = Number(form.totalTickets);
  if (value < 0) {
    e.totalTickets = "Cannot be negative";
  } else if (value === 0) {
    e.totalTickets = "Cannot be zero";
  }
  else if (value > 100) {
    e.totalTickets = "Cannot be over 100 seats";
  }
   else if (value < 20) {
    e.totalTickets = "Cannot be under 20 seats";
  }
}


  // Ticket prices
if (!rows || rows.length === 0) {
  e.price = "No ticket rows found";
} else {
  rows.forEach(row => {
    const value = form[`price${row}`];

    if (value === "" || value === undefined) {
      e[`price${row}`] = "Required";
    } else if (Number(value) < 0) {
      e[`price${row}`] = "Cannot be negative";
    }
  });
}




  // Image url
 if (!form.photo || !form.photo.trim()) {
    e.photo = "Required image URL";
  } 
  else {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    if (!urlPattern.test(form.photo)) {
      e.photo = "Must be a valid image URL";
    }
  }
  //  else {
  //     // async existence check
  //     const exists = await checkImageExists(form.photo);
  //     if (!exists) e.photo = "Image does not exist";
  //   }
  // }

  //description
  if (!form.description || !form.description.trim()) {
  e.description = "Required";
} else {
  const urlPattern = /(https?:\/\/|www\.)/i;
  if (urlPattern.test(form.description)) {
    e.description = "URLs are not allowed here";
  } else if (/^\d+$/.test(form.description.trim())) {
      e.description = "Cannot be only numbers";
    }
}

    return (e);
  };