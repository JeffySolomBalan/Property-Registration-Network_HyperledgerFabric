# Property Registration System
A hyperledger fabric network for property registration system

## Fabric Network
- 2 Organizations (Org1, Org2)
- TLS Disabled
- 1 Peer for Org1
- 1 Peer for Org2


## Network Setup

Move to the test-network folder inside the property-registration project. This folder contains the  script for network automation.

1. Docker Network Set up

    ./network.sh up

2. Creation of channel with custom name
	
    ./network.sh createChannel -c propertyregistrationnet
	
3. Chaincode Installation and Instantiation
	
    ./network.sh deployCC -c propertyregistrationnet -ccn propreg -ccl javascript -ccp ../chaincode -ccv 1 -ccs 1 -cci instantiate


## Testing the chaincode:

#### 1. ***requestNewUser(userName, email, socialSecurityNumber, phone)*** 

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"user:requestNewUser","Args":["Jeffy", "Jeffy@gmail.com", "1", "23456"]}'



../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"user:requestNewUser","Args":["Solom", "Solom@gmail.com", "2",
"90876"]}'



2. ***approveNewUser(userName, ssn)***

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"registrar:approveNewUser","Args":["Jeffy", "1"]}'



../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"registrar:approveNewUser","Args":["Solom", "2"]}'



3. ***viewUser(userName, ssn)***

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"registrar:viewUser","Args":["Jeffy", "1"]}'



../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"registrar:viewUser","Args":["Solom", "2"]}'



4. ***rechargeAccount(userName, ssn, bankTrxID)***

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"user:rechargeAccount","Args":["Solom", "2", "upg1000"]}'



../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"user:rechargeAccount","Args":["Solom", "2", "upg1000"]}'



5. ***propertyRegistrationRequest(propertyId, address, propSizeinSqft, propertyPrice, status, ownerName, ssn)***

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"user:propertyRegistrationRequest","Args":["001", "Pune", "500sqft", "1500",
"registered","Jeffy", "1"]}'



6. ***approvePropertyRegistration(propertyId)***

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"registrar:approvePropertyRegistration","Args":["001"]}'



7. ***viewProperty(propertyId)***

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"registrar:viewProperty","Args":["001"]}'



8. ***updateProperty(propertyID, name, aadharNo, status)*** 

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"user:updateProperty","Args":["001", "onSale", "Jeffy", "1"]}'



9. ***purchaseProperty(propId, buyerName, buyerSSN)***

../bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride
orderer.example.com --tls true --cafile
${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/
tlscacerts/tlsca.example.com-cert.pem -C propertyregistrationnet -n propreg --peerAddresses
localhost:7051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/
ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles
${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/
ca.crt -c '{"function":"user:purchaseProperty","Args":["001", "Solom", "2"]}'