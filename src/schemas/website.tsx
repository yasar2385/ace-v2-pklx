import * as Yup from 'yup';

export const urlPatterns = {
  basic: /^(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(com|co|[a-zA-Z]{2,})$/,
  withProtocol: /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(com|co|[a-zA-Z]{2,})$/,
  govDomains: [
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.(gov|com|co)(\S*)?$/i,
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.us(\S*)?$/i,
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.state\.[a-z]{2}(\S*)?$/i,
    /^(https?:\/\/)?(www\.)?courts\.[a-zA-Z0-9-]+\.(gov|us|com|co)(\S*)?$/i,
    /^(https?:\/\/)?(www\.)?judiciary\.[a-zA-Z0-9-]+\.(gov|us|com|co)(\S*)?$/i,
  ],
};

export const validationMessages = {
  required: 'This field is required',
  url: {
    invalid: 'Please enter a valid URL',
    protocol: 'Please use HTTPS protocol',
    domain: 'Please enter a valid website',
  },
};

export const urlTransforms = {
  addHttps: (value: string): string => {
    if (value && !value.startsWith('http')) {
      return `https://${value}`;
    }
    return value;
  },
};

export const urlTests = {
  isValidCourtUrl: (value: string): boolean => {
    if (!value) return false;
    console.log('isValidCourtUrl');
    return urlPatterns.govDomains.some((pattern) => pattern.test(value));
  },
  isSecureProtocol: (value: string): boolean => {
    if (!value) return true;
    console.log('isSecureProtocol');
    return !value.startsWith('http:');
  },
};

export const WebsiteSchema = Yup.string()
  .required(validationMessages.required)
  .test(
    'valid-court-url',
    validationMessages.url.domain,
    urlTests.isValidCourtUrl
  )
  .test(
    'secure-protocol',
    validationMessages.url.protocol,
    urlTests.isSecureProtocol
  )
  .transform(urlTransforms.addHttps);



/*
 
export const validationSchema = Yup.object().shape({
  court_website: courtWebsiteSchema
});
 
// Example usage file
import { validationSchema } from './validations/schemas';
 
const validateForm = async (formData) => {
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    return err.errors;
  }
}; 
*/