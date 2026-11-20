import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Conferencia from "./Conferencia";

export interface RemessaAttributes {
  id: number;
  conferencia_id: number;
  numero_remessa: number;
  arquivo_nome: string;
  total_pacotes: number;
  data_importacao: Date;
}

export interface RemessaCreationAttributes extends Optional<
  RemessaAttributes,
  "id" | "total_pacotes" | "data_importacao"
> {}

export class Remessa
  extends Model<RemessaAttributes, RemessaCreationAttributes>
  implements RemessaAttributes
{
  declare public id: number;
  declare public conferencia_id: number;
  declare public numero_remessa: number;
  declare public arquivo_nome: string;
  declare public total_pacotes: number;
  declare public data_importacao: Date;
}

Remessa.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    conferencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "conferencias", key: "id" },
    },
    numero_remessa: { type: DataTypes.INTEGER, allowNull: false },
    arquivo_nome: { type: DataTypes.STRING(255), allowNull: false },
    total_pacotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    data_importacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "remessas", timestamps: false },
);

Conferencia.hasMany(Remessa, { foreignKey: "conferencia_id", as: "remessas" });
Remessa.belongsTo(Conferencia, {
  foreignKey: "conferencia_id",
  as: "conferencia",
});

export default Remessa;
