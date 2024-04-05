const CONSTANT =  Object.freeze({
    MESSAGE_CONSTANT:{
        ERROR:'Error',
        SUCCESS:'Success',
        SOMETHING_WENT_WRONG:'Something went wrong !',
        INVALID_TOKEN:'Invalid Token',
        TOKEN_NOT_FOUND:'Access denied. Token Not Found',
        UNATHORIZED_PERSON:'Unautorized Person',
        EMPLOYEE_CREATE_SUCCESSFULLY:'Employee registered successfully',
    },

    STATE:{
        SUCCESS: 'SUCCESS',
        FAILED: 'FAILED',
        EMPTY: 'EMPTY',
    },
    
    LABEL_CONSTANT:{
        AUTH:{
            AUTHORIZATION:'authorization'
          },
        EMPLOYEE:{
        }
    },
    JWT:{
        SECRET:'rtplsecret'
      },
    BCRYPT:{
        SALTROUNDS: 10
      }
});

module.exports = CONSTANT;