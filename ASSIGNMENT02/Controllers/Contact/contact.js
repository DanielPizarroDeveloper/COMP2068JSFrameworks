require('dotenv').config();
const { handleErrorEmail } = require('../../public/mocks/Message'); 

//Templates Body Email
function templateMail(topic, customerName, customerEmail, description) {
    if(!topic || !customerName || !customerEmail || !description) {
        throw new Error (handleErrorEmail());   
    }
    else {
        switch (topic) {
            case 'Request a quote':
                topicData = {
                    title: 'Request a quote',
                    message: 'We will send you a detailed quote shortly.' 
                }
            break;
    
            case 'Check availability':
                topicData = {
                    title: 'Check availability',
                    message: 'We will confirm availability and update you as soon as possible.' 
                }
            break;
    
            case 'Material & design advice':
                topicData = {
                    title: 'Material & design advice',
                    message: 'Our experts will provide personalized recommendations.' 
                }
            break;
    
            case 'Order tracking':
                topicData = {
                    title: 'Order tracking',
                    message: 'We will check the status of your order and provide an update soon.' 
                }
            break;
    
            case 'Other inquiry':
                topicData = {
                    title: 'Other inquiry',
                    message: 'Our team is available to assist you and answer any questions.' 
                }
            break;
        }
    
        return {
            from: process.env.EMAIL_APP,
            to: customerEmail,
            cc: process.env.EMAIL_APP,
            subject: topic,
            html: bodyContent(customerName, topicData, description)
        };
    }
}

const bodyContent = (customerName, topicData, description) => {
    return `Dear ${customerName},` + "<br> <br>" +
            `Thank you for reaching out. We have received your request regarding ${topicData.title}` + " and our team is currently reviewing it."+ "<br> <br>" +"Below is your inquiry for your reference: " + "<br> <br>" + 
            "Customer's inquiry: " + "<br> <br>" +
            `${description}` + "<br> <br>" +
            `${topicData.message}` + "<br> <br>" +
            "We will get back to you shortly. If you need further assistance, please don’t hesitate to reach out."  + "<br> <br>" +
            "Best Regards" + "<br>" +
            "Tapiceria Leone" + "<br>" +
            `${process.env.EMAIL_APP}` + "<br>" +
            "www.tapiceriaLeone.cl";
}

module.exports = templateMail;