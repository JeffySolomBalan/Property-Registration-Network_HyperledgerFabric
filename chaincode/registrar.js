'use strict';

const {Contract} = require('fabric-contract-api');
class RegistrarContract extends Contract{
    constructor() {
        super('registrar');
    }

    async instantiate(ctx)
    {
        console.log('Registrar Chaincode was successfully deployed!!')
    }
    /* This method would run by a registrar 
     * and it would be approve a request for new user 
     * and add a user asset into the network
     */
    async approveNewUser(ctx, userName, ssn)
    {
        const requestKey = ctx.stub.createCompositeKey('propreg.request',[userName, ssn]);
        const requestBuffer = await ctx.stub.getState(requestKey).catch(err => console.log(err));
        let userObj;
        if(requestBuffer && requestBuffer.length > 0)
        {
            const retValue = await this.validateUser(ctx, userName, ssn);
            if(retValue == 1)
            {
                const requestObj = JSON.parse(requestBuffer.toString());
                if(requestObj)
                {
                    const userKey = ctx.stub.createCompositeKey('propreg.user',[userName, ssn]);
                    userObj = {
                        docType:'user',
                        userName : userName,
                        upgradCoins : 0,
                        email:requestObj.email,
                        ssn:ssn,
                        phone:requestObj.phone,
                        createdAt : requestObj.createdAt
                    };
                    const userBuffer = Buffer.from(JSON.stringify(userObj));
                    await ctx.stub.putState(userKey, userBuffer);
                }
            }
            else if(retValue == 2)
            {
                return 'User with Key ['+userName+', '+ssn+'] already exists in network';
            }
            else
            {
                return 'User validation failed';
            }
        }
        else
        {
            return 'User with Key ['+userName+', '+ssn+'] does not exist in network';
        }
        return userObj;
    }

    /* This method would run by a registrar 
     * and it would be approve a request for new property 
     * and add a property asset into the network
     */
    async approvePropertyRegistration(ctx, propertyId)
    {
        const requestKey = ctx.stub.createCompositeKey('propreg.request',[propertyId]);
        const requestBuffer = await ctx.stub.getState(requestKey);
        if(requestBuffer && requestBuffer.length > 0)
        {
            const retValue = await this.validateProp(ctx, propertyId);
            if(retValue == 1)
            {
                const requestPropertyObj = JSON.parse(requestBuffer.toString());
                const propObj = {
                    docType:'property',
                    propertyId : propertyId,
                    address : requestPropertyObj.address,
                    propertySizeinSqft : requestPropertyObj.propSizeinSqft,
                    createdAt : requestPropertyObj.createdAt,
                    propertyOwner : requestPropertyObj.propertyOwner,
                    propertyPrice : requestPropertyObj.propertyPrice,
                    status : requestPropertyObj.status
                };
                const updatedPropertyBuffer = Buffer.from(JSON.stringify(propObj));
                const propertyKey = ctx.stub.createCompositeKey('propreg.property',[propertyId]);
                await ctx.stub.putState(propertyKey, updatedPropertyBuffer);
                return propObj;
            }
            else if(retValue == 2)
            {
                return 'Property with Key '+propertyId+' already exists in network';
            }
            else
            {
                return 'Property validation failed';
            }
        }
        else
        {
            return 'Property with Key '+propertyId+' does not exist in network';
        }
    }

    /*
     * Method to validate a user before adding to a network
     */
    async validateUser(ctx, userName, ssn)
    {
        //logic to validate a user
        const userKey = ctx.stub.createCompositeKey('propreg.user',[userName, ssn]);
        const userBuffer = await ctx.stub.getState(userKey);
        if(userBuffer && userBuffer.length > 0 )
        {
            return 2;
        }
        else
        {
            return 1;
        }
    }

    /*
     * Method to validate a Property before adding to a network
     */
    async validateProp(ctx, propertyId)
    {
        const propertyKey = ctx.stub.createCompositeKey('propreg.property',[propertyId]);
        const propertyBuffer = await ctx.stub.getState(propertyKey);
        if(propertyBuffer && propertyBuffer.length > 0 )
        {
            return 2;
        }
        else
        {
            return 1;
        }
    }

    /*
     * Method to View User Details
     */
    async viewUser(ctx, userName, ssn)
    {
        const userKey = ctx.stub.createCompositeKey('propreg.user',[userName, ssn]);
        const userBuffer = await ctx.stub.getState(userKey);
        if(userBuffer && userBuffer.length > 0)
        {
            return JSON.parse(userBuffer.toString());
        }
        else
        {
            return 'User with Key ['+userName+', '+ssn+'] does not exist in network';
        }
    }

    /* 
     *  Method to View Property Details
     */
    async viewProperty(ctx, propertyID)
    {
        const propKey = ctx.stub.createCompositeKey('propreg.property',[propertyID]);
        const propBuffer =  await ctx.stub.getState(propKey);
        if(propBuffer && propBuffer.length > 0)
        {
            return JSON.parse(propBuffer.toString());
        }
        else
        {
            return 'Property with Key '+propertyID+' does not exist in network';
        }
    }
}

module.exports = RegistrarContract;
