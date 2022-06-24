export const formatDateTime = (date) => {
   const d = new Date(date);

   let day = d.getDate().toString().padStart(2, '0');
   let mon = (d.getMonth() + 1).toString().padStart(2, '0');
   let year = d.getFullYear();

   let hou = d.getHours().toString().padStart(2, '0');
   let min = d.getMinutes().toString().padStart(2, '0');

   return `${hou}:${min} ${day}/${mon}/${year}`;
};
export const formatDate = (date) => {
   const d = new Date(date);

   let day = d.getDate().toString().padStart(2, '0');
   let mon = (d.getMonth() + 1).toString().padStart(2, '0');
   let year = d.getFullYear();

   return `${day}/${mon}/${year}`;
};

export const formatAddress = (storeAddress) => {
   return `${storeAddress.exactAddress}, ${storeAddress.village}, ${storeAddress.district}, ${storeAddress.province}`;
};

export const formatCost = (cost) => {
   var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
   });
   // cost *= 1000;
   return `${formatter.format(cost)}`;
};