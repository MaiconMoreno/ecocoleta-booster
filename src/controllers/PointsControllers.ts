import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.Item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return response.json({ points });
  }

  async show(request: Request, response: Response) {
    // seria a mesma coisa que
    //const id = request.params.id;
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ message: "Point not found." });
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const trx = await knex.transaction();

    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const linkImage =
      "https://images.unsplash.com/photo-1548148870-adbf75452257?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60";

    const point = {
      image: linkImage,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    // const insertedIds = await knex('points').insert(point);
    const insertedIds = await trx("points").insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    try {
      // await knex('point_items').insert(pointItems);
      await trx("point_items").insert(pointItems);

      await trx.commit();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        message:
          "Falha na inserção na tabela point_items, verifique se os items informados são válidos",
      });
    }

    return response.json({ id: point_id, ...point });
  }
}

export default PointsController;
