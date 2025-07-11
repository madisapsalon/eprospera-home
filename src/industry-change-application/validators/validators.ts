import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { Industry } from "../enums/industry.enum";
import { RegulatoryElection } from "../enums/regulatory-election.enum";

type ValidatorType = 'industry' | 'regulatoryElection' | 'regulatoryElectionSub';

/**
 * Creates a validator function based on the validator type
 * @param type The type of validator to create
 * @param validationOptions Optional validation options
 * @returns A validator function
 */
function createValidator(type: ValidatorType, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    const validatorName = `validate${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    registerDecorator({
      name: validatorName,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          const willWorkInPhysical = object.willWorkInPhysicalJurisdiction;
          
          if (willWorkInPhysical === true) {
            switch (type) {
              case 'industry':
                return value !== null && value !== undefined && Object.values(Industry).includes(value);
              case 'regulatoryElection':
                return value !== null && value !== undefined && Object.values(RegulatoryElection).includes(value);
              case 'regulatoryElectionSub':
                return value === null || typeof value === 'string';
              default:
                return false;
            }
          }
          
          return value === null;
        },
        defaultMessage(args: ValidationArguments) {
          const object = args.object as any;
          const willWorkInPhysical = object.willWorkInPhysicalJurisdiction;
          
          if (willWorkInPhysical === true) {
            switch (type) {
              case 'industry':
                return 'Industry is required and must be a valid enum value when working in physical jurisdiction';
              case 'regulatoryElection':
                return 'RegulatoryElection is required and must be a valid enum value when working in physical jurisdiction';
              case 'regulatoryElectionSub':
                return 'RegulatoryElectionSub must be a string or null when working in physical jurisdiction';
              default:
                return 'Invalid value';
            }
          }
          
          const fieldName = type.charAt(0).toUpperCase() + type.slice(1);
          return `${fieldName} must be null when not working in physical jurisdiction`;
        }
      },
    });
  };
}

export function ValidateIndustry(validationOptions?: ValidationOptions) {
  return createValidator('industry', validationOptions);
}

export function ValidateRegulatoryElection(validationOptions?: ValidationOptions) {
  return createValidator('regulatoryElection', validationOptions);
}

export function ValidateRegulatoryElectionSub(validationOptions?: ValidationOptions) {
  return createValidator('regulatoryElectionSub', validationOptions);
}