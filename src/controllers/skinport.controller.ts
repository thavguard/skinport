import { FastifyReply, FastifyRequest } from "fastify";
import { redisClient } from "../services/redis.service";
import { config } from "../config";

export async function getSkinportPrices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const cacheKey = "skinport_min_prices";
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return reply.send(JSON.parse(cachedData));
  }
  try {
    const apiResponse = await fetch(
      `${config.skinportApiUrl}?app_id=${config.appId}&currency=${config.currency}`
    );
    const data = await apiResponse.json();
    const result = data.items.map((item: any) => {
      const tradablePrices = item.prices.filter((p: any) => p.tradable);
      const nonTradablePrices = item.prices.filter((p: any) => !p.tradable);
      return {
        id: item.id,
        minTradable: Math.min(...tradablePrices.map((p: any) => p.price)),
        minNonTradable: Math.min(...nonTradablePrices.map((p: any) => p.price)),
      };
    });
    await redisClient.set(cacheKey, JSON.stringify(result), "EX", 60);
    return reply.send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Ошибка при получении данных от Skinport API" });
  }
}
