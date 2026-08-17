import fs from 'fs';
import path from 'path';

describe('Agent socket metrics contract', () => {
  it('uses the same event name for agent emission and backend subscription', () => {
    const agentSource = fs.readFileSync(
      path.resolve(__dirname, '../../../../../../apps/agent/modules/metrics/metric.ts'),
      'utf8',
    );
    const gatewaySource = fs.readFileSync(
      path.resolve(__dirname, 'agent.gateway.ts'),
      'utf8',
    );

    expect(agentSource).toContain('socket.emit("findMetrics"');
    expect(gatewaySource).toContain("@SubscribeMessage('findMetrics')");
    expect(gatewaySource).toContain("@SubscribeMessage('sendMetrics')");
  });
});
