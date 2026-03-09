import sendMetrics from "./metric";

function startMetrics() {
  sendMetrics();
  setInterval(sendMetrics, 30000);
}

export default startMetrics;
