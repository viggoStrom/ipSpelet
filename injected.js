// applies on https://ip.ntig.dev/
// uses https://chromewebstore.google.com/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk?hl=en-US&utm_source=ext_sidebar

const clientPanel = document.querySelector("tbody").children
const gatewayPanel = document.querySelectorAll("tbody")[1].children[1].children
const serverPanel = document.querySelectorAll("tbody")[2].children

const location = [
    // Client
    clientPanel[1].children[1].children[0].value, // ip
    clientPanel[2].children[1].children[0].value, // mask
    clientPanel[3].children[1].children[0].value, // gateway
    clientPanel[4].children[1].children[0].value, // netID

    gatewayPanel[1].children[0].value, // client gateway
    gatewayPanel[3].children[0].value, // server gateway

    serverPanel[1].children[1].children[0].value, // ip
    serverPanel[2].children[1].children[0].value, // mask
    serverPanel[3].children[1].children[0].value, // gateway
    serverPanel[4].children[1].children[0].value, // netID
]

const client = {
    IP: location[0],
    mask: location[1],
    gateway: location[2],
    netID: location[3],
}
const gateway = {
    client: location[4],
    server: location[5],
}
const server = {
    IP: location[6],
    mask: location[7],
    gateway: location[8],
    netID: location[9],
}


console.log("Client", client);
console.log("Gateway", gateway);
console.log("Server", server);


// The Logic-ining

if (
    client.IP === ""
    &&    
    client.mask === ""
    &&    
    client.gateway === ""
    &&    
    client.netID === ""
    &&    
    gateway.client === ""
) {
    location[0] = "1.2.3.4"
    location[1] = "255.255.255.0"
    location[2] = "1.2.3.5"
    location[3] = "1.2.3.0"

    location[4] = "1.2.3.5"
}

if (
    gateway.client === ""
    &&
    client.gateway !== ""
) {
    gateway.client = client.gateway
}
else if (
    gateway.client !== ""
    &&
    client.gateway === ""
) {
    client.gateway = gateway.client
}
if (
    gateway.server === ""
    &&
    server.gateway !== ""
) {
    gateway.server = server.gateway
}
else if (
    gateway.server !== ""
    &&
    server.gateway === ""
) {
    server.gateway = gateway.server
}

// loop through and enter the new results at every location missing a value i.e. .value === ""