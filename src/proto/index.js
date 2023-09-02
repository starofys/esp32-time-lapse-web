import Esp from '/src/proto/esp_control_pb.js'
const buildOptions = (opt)=> {
    const options = []
    for (const k in opt) {
        options.push({
            label: k,
            value: opt[k]
        })
    }
    options.sort((a,b)=> a.value - b.value)
    return options;
}
export {
    Esp,
    buildOptions
}