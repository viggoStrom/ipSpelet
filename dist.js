// applies on https://ip.ntig.dev/
// uses https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=sv

const clientPanel = document.querySelector("tbody").children
const gatewayPanel = document.querySelectorAll("tbody")[1].children[1].children
const serverPanel = document.querySelectorAll("tbody")[2].children

const locations = [
    // Client
    clientPanel[1].children[1].children[0].value, // ip
    clientPanel[2].children[1].children[0].value, // mask
    clientPanel[3].children[1].children[0].value, // gateway
    clientPanel[4].children[1].children[0].value, // netID

    gatewayPanel[1].children[0].value, // client gateway
    gatewayPanel[3].children[0].value, // server gateway

    // Server
    serverPanel[1].children[1].children[0].value, // ip
    serverPanel[2].children[1].children[0].value, // mask
    serverPanel[3].children[1].children[0].value, // gateway
    serverPanel[4].children[1].children[0].value, // netID
]

const client = {
    IP: locations[0],
    mask: locations[1],
    gateway: locations[2],
    netID: locations[3],
    name: "client"
}
const gateway = {
    client: locations[4],
    server: locations[5],
}
const server = {
    IP: locations[6],
    mask: locations[7],
    gateway: locations[8],
    netID: locations[9],
    name: "server"
}


const hearts = document.getElementById("hearts")
const observer = new MutationObserver((mutations) => {
    if (
        mutations.length > 0
        &&
        hearts.children.length > 0
    ) {
        location.reload()
    }
})
observer.observe(document.getElementById("myForm"), { attributes: true, childList: false, subtree: false })

addEventListener("load", (event) => {
    client.IP = "1.0.0.1"
    client.mask = "255.0.0.0"
    client.gateway = "1.0.0.0"
    gateway[client.name] = "1.0.0.0"
    client.netID = "1.0.0.0"

    server.IP = "2.0.0.1"
    server.mask = "255.0.0.0"
    server.gateway = "2.0.0.0"
    gateway[server.name] = "2.0.0.0"
    server.netID = "2.0.0.0"

    clientPanel[1].children[1].children[0].value = client.IP
    clientPanel[2].children[1].children[0].value = client.mask
    clientPanel[3].children[1].children[0].value = client.gateway
    clientPanel[4].children[1].children[0].value = client.netID
    gatewayPanel[1].children[0].value = gateway.client
    gatewayPanel[3].children[0].value = gateway.server
    serverPanel[1].children[1].children[0].value = server.IP
    serverPanel[2].children[1].children[0].value = server.mask
    serverPanel[3].children[1].children[0].value = server.gateway
    serverPanel[4].children[1].children[0].value = server.netID
})