'use strict';

const {Contract} = require('fabric-contract-api');
class UserContract extends Contract{
    constructor() {
        super('user');
    }

    async instantiate(ctx)
    {
        console.log('User Chaincode was successfully deployed!!')
    }
    
    /* Method to create a new user request
     * User details like user name, email, Social security number, phone
     * are passed as parameters   
     */
    async requestNewUser(ctx, userName, email, ssn, phone)
    {
        const userKey = ctx.stub.createCompositeKey('propreg.request',[userName, ssn]);
        const userObj = {
            docType:'request',
            userName : userName,
            upgradCoins : 0,
            email:email,
            phone:phone,
            ssn:ssn,
            createdAt : ctx.stub.getTxTimestamp()
        };
        const userBuffer = Buffer.from(JSON.stringify(userObj));
        await ctx.stub.putState(userKey, userBuffer);
        return userObj;
    }

    /*
     * Method to recharge User Account with bankTrxID
     * BankTrxID can obly be upg100, upg500, upg1000
     */ 
    async rechargeAccount(ctx, userName, ssn, bankTrxID)
    {
        let amountToBeRecharged;
        switch(bankTrxID)
        {
            case 'upg100':
                amountToBeRecharged = 100;
                break;
            case 'upg500':
                amountToBeRecharged = 500;
                break;
            case 'upg1000':
                amountToBeRecharged = 1000;
                break;
            default:
                return 'Invalid Bank Transaction ID';
        }
        const userKey = ctx.stub.createCompositeKey('propreg.user',[userName, ssn]);
        const userBuffer = await ctx.stub.getState(userKey);
        if(userBuffer && userBuffer.length > 0)
        {
            const userObj = JSON.parse(userBuffer.toString());
            userObj.upgradCoins = userObj.upgradCoins + amountToBeRecharged;
            await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(userObj)));
            return userObj.upgradCoins;
        }
        else
        {
            return 'User with Key ['+userName+', '+ssn+'] does not exist in network';
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
     * Method to View Property Details
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

    /* Method to create Property Registration Request
    * Property details like PropertyID, Address, property in Sq ft, Property Price
    * status are passed as parameters 
    */
    async propertyRegistrationRequest(ctx, propertyId, address, propSizeinSqft, propertyPrice, status, ownerName, ssn)
    {
        const propKey = ctx.stub.createCompositeKey('propreg.request',[propertyId]);
        const userKey = ctx.stub.createCompositeKey('propreg.user',[ownerName, ssn]);
        if(!userKey || userKey.length < 0)
        {
            return 'Property Owner is not yet registered in the network';
        }
        const propObj = {
            docType:'property',
            propertyId : propertyId,
            address : address,
            propertySizeinSqft : propSizeinSqft,
            createdAt : ctx.stub.getTxTimestamp(),
            propertyOwner : userKey,
            propertyPrice : propertyPrice,
            status : status
        };
        const propBuffer = Buffer.from(JSON.stringify(propObj));
        await ctx.stub.putState(propKey, propBuffer);
        return propObj;
    }

    /* This method would update the property status.
     * Status can be either registered or onSale.
     * Only property owner can update the property 
     */
    async updateProperty(ctx, propId, status, ownerName, ssn)
    {

        const propKey = ctx.stub.createCompositeKey('propreg.property',[propId]);
        const propBuffer = await ctx.stub.getState(propKey);
        if(propBuffer && propBuffer.length > 0)
        {
            const property = JSON.parse(propBuffer.toString());
            const userKey = ctx.stub.createCompositeKey('propreg.user',[ownerName, ssn]);
            if(property.propertyOwner === userKey)
            {
                property.status = status;
                const updatedPropBuffer = Buffer.from(JSON.stringify(property));
                await ctx.stub.putState(propKey, updatedPropBuffer);
            }
            else
            {
                return 'User ['+ownerName+', '+ssn+'] is not the owner of the property with key ['+propId+']';
            }
        }
        else
        {
            return 'Property with Key ['+propId+'] does not exist in network';
        }
    }

    /* This method would update the property price.
     * 
     * Only property owner can update the property 
     */
    async updatePropertyPrice(ctx, propId, price, ownerName, ssn)
    {

        const propKey = ctx.stub.createCompositeKey('propreg.property',[propId]);
        const propBuffer = await ctx.stub.getState(propKey);
        if(propBuffer && propBuffer.length > 0)
        {
            const property = JSON.parse(propBuffer.toString());
            const userKey = ctx.stub.createCompositeKey('propreg.user',[ownerName, ssn]);
            if(property.propertyOwner === userKey)
            {
                property.propertyPrice = price;
                const updatedPropBuffer = Buffer.from(JSON.stringify(property));
                await ctx.stub.putState(propKey, updatedPropBuffer);
            }
            else
            {
                return 'User ['+ownerName+', '+ssn+'] is not the owner of the property with key ['+propId+']';
            }
        }
        else
        {
            return 'Property with Key ['+propId+'] does not exist in network';
        }
    }

    /* Method to buy properties which are on Sale.
     * Once property is purchased, property ownership is transferred to buyer.
     * Property price amount is reduced from Buyer's account and 
     * added to seller's account
     */
    async purchaseProperty(ctx, propId, buyerName, buyerSSN)
    {
        const propKey = ctx.stub.createCompositeKey('propreg.property',[propId]);
        const propBuffer = await ctx.stub.getState(propKey);
        if(propBuffer && propBuffer.length > 0)
        {
            const property = JSON.parse(propBuffer.toString());
            const retValue = await this.validateForBuy(property, ctx, buyerName, buyerSSN);
            if(String(retValue) == 'validated')
            {
                const sellerKey = property.propertyOwner;
                const buyerKey = ctx.stub.createCompositeKey('propreg.user',[buyerName, buyerSSN]);
                property.propertyOwner = buyerKey;
                const buyerBuffer = await ctx.stub.getState(buyerKey);
                if(buyerBuffer && buyerBuffer.length > 0)
                {
                    const buyer =  JSON.parse(buyerBuffer.toString());
                    buyer.upgradCoins = buyer.upgradCoins - property.propertyPrice;
                    const updatedBuyerBuffer = Buffer.from(JSON.stringify(buyer));
                    await ctx.stub.putState(buyerKey, updatedBuyerBuffer);
                }

                const sellerBuffer = await ctx.stub.getState(sellerKey);
                if(sellerBuffer && sellerBuffer.length > 0)
                {
                    const seller =  JSON.parse(sellerBuffer.toString());
                    seller.upgradCoins = seller.upgradCoins + property.propertyPrice;
                    const updatedSellerBuffer = Buffer.from(JSON.stringify(seller));
                    await ctx.stub.putState(sellerKey, updatedSellerBuffer);
                }
                property.status = 'registered';
                const updatedPropBuffer = Buffer.from(JSON.stringify(property));
                await ctx.stub.putState(propKey, updatedPropBuffer);
            }
            else
            {
                return retValue;
            }
            
        }
        else
        {
            return 'Property with Key ['+propId+'] does not exist in network';
        }
    }

    /* This method validates before any purchase is made 
     * Property's status should be onSale.
     * Buyer should be registered on the network
     * Buyer should have atleast price of the property in their account to make a trxn
     */
    async validateForBuy(property, ctx, buyerName, buyerSSN)
    {
        if(property.status === 'onSale')
        {
            const userKey = ctx.stub.createCompositeKey('propreg.user',[buyerName, buyerSSN]);
            const userBuffer = await ctx.stub.getState(userKey);
            if(userBuffer && userBuffer.length > 0)
            {
                const buyer =  JSON.parse(userBuffer.toString());
                if(buyer.upgradCoins >= property.propertyPrice)
                {
                    return 'validated';
                }
                else
                {
                    //Buyer doesnt have enough coins
                    return 'Buyer doesnt have enough coins';
                }
            }
            else
            {
                //Buyer is not registered in the network
                return 'Buyer with details ['+buyerName+', '+buyerSSN+'] is not registered in the network';
            }
        }
        else
        {
            //Property is not on sale
            return 'Property  with key ['+property.propertyId+'] is not on sale';
        }
    }
}
module.exports = UserContract;
