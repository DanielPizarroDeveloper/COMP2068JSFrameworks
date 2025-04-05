const Service = require('../../models/service');
const { normalize_identifier } = require('../normalize');

const { handleFailedUpdate, handleFailedDelete, handleIncompleteForm, handleErrorSystem, handleNotFoundData } = require('../../public/mocks/Message');

const createService = async(serviceName, serviceDescription, servicePrice, imgURL, today) => {
  if(!serviceName || !serviceDescription || !servicePrice || !imgURL) {
    throw new Error(handleIncompleteForm());
  }
  else {
      let newService = new Service({
        title: serviceName,
        detail: serviceDescription,
        price: servicePrice,
        imgService: imgURL,
        publication: today
      });
      
      await newService.save();
      return true;
  }
}

const getService = async () => {
  const services = await Service.find();

  if (services.length > 0) {
    const servicesOrderBy = services.sort((a, b) => new Date(b.publication) - new Date(a.publication));
    return servicesOrderBy;
  } else {
    throw Error(handleNotFoundData());
  }
}

const updatedServiceByID = async(ID, serviceName, serviceDescription, servicePrice, serviceImage, today) => {
  try {
      const serviceID = normalize_identifier(ID);
      let path = serviceImage.length;
      if (path > 0) {
        await Service.findByIdAndUpdate(
          { _id: serviceID },
          {
            title: serviceName,
            detail: serviceDescription,
            price: servicePrice,
            imgService: serviceImage,
            publication: today
          }
        )
      } else {
        await Service.findByIdAndUpdate(
          { _id: serviceID },
          {
            title: serviceName,
            detail: serviceDescription,
            price: servicePrice,
            publication: today
          }
        )
      }
      return true;
  } catch (error) {
      throw Error(handleFailedUpdate())
  }
}

const deleteServiceByID = async(ID) => {
  try {
      const serviceID = normalize_identifier(ID);
      await Service.findByIdAndDelete(serviceID);
      return true;
  } catch (error) {
      throw new Error(handleFailedDelete());
  }
}

module.exports = {
    createService,
    getService,
    updatedServiceByID,
    deleteServiceByID
}