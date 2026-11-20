import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Conferencia from "./Conferencia";
import Remessa from "./Remessa";
import CaixaEmbalagem from "./CaixaEmbalagem";
import Usuario from "./Usuario";

export interface PacoteAttributes {
  id: number;
  conferencia_id: number;
  remessa_id: number;
  chave_acesso: string;
  numero_nf: string;
  razao_social?: string;
  descricao_produto?: string;
  uf: string;
  status:
    | "pendente"
    | "ok"
    | "divergente_peso"
    | "bloqueado"
    | "liberado_divergente"
    | "duplicado";
  possui_guia_icms: boolean;
  caixa_id?: number | null;
  peso_esperado_g?: number | null;
  peso_lido_g?: number | null;
  tentativas_peso: number;
  justificativa_liberacao?: string | null;
  usuario_liberacao_id?: number | null;
  data_conferido?: Date | null;
}

export interface PacoteCreationAttributes extends Optional<
  PacoteAttributes,
  "id" | "status" | "possui_guia_icms" | "tentativas_peso"
> {}

export class Pacote
  extends Model<PacoteAttributes, PacoteCreationAttributes>
  implements PacoteAttributes
{
  declare public id: number;
  declare public conferencia_id: number;
  declare public remessa_id: number;
  declare public chave_acesso: string;
  declare public numero_nf: string;
  declare public razao_social?: string;
  declare public descricao_produto?: string;
  declare public uf: string;
  declare public status:
    | "pendente"
    | "ok"
    | "divergente_peso"
    | "bloqueado"
    | "liberado_divergente"
    | "duplicado";
  declare public possui_guia_icms: boolean;
  declare public caixa_id?: number | null;
  declare public peso_esperado_g?: number | null;
  declare public peso_lido_g?: number | null;
  declare public tentativas_peso: number;
  declare public justificativa_liberacao?: string | null;
  declare public usuario_liberacao_id?: number | null;
  declare public data_conferido?: Date | null;
}

Pacote.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    conferencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "conferencias", key: "id" },
    },
    remessa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "remessas", key: "id" },
    },
    chave_acesso: {
      type: DataTypes.STRING(44),
      allowNull: false,
      unique: true,
    },
    numero_nf: { type: DataTypes.STRING(20), allowNull: false },
    razao_social: { type: DataTypes.STRING(255), allowNull: true },
    descricao_produto: { type: DataTypes.STRING(255), allowNull: true },
    uf: { type: DataTypes.CHAR(2), allowNull: false },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pendente",
    },
    possui_guia_icms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    caixa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "caixas_embalagem", key: "id" },
    },
    peso_esperado_g: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    peso_lido_g: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    tentativas_peso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    justificativa_liberacao: { type: DataTypes.TEXT, allowNull: true },
    usuario_liberacao_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "usuarios", key: "id" },
    },
    data_conferido: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: "pacotes", timestamps: false },
);

Conferencia.hasMany(Pacote, { foreignKey: "conferencia_id", as: "pacotes" });
Pacote.belongsTo(Conferencia, {
  foreignKey: "conferencia_id",
  as: "conferencia",
});

Remessa.hasMany(Pacote, { foreignKey: "remessa_id", as: "pacotes" });
Pacote.belongsTo(Remessa, { foreignKey: "remessa_id", as: "remessa" });

CaixaEmbalagem.hasMany(Pacote, { foreignKey: "caixa_id", as: "pacotes" });
Pacote.belongsTo(CaixaEmbalagem, { foreignKey: "caixa_id", as: "caixa" });

Usuario.hasMany(Pacote, {
  foreignKey: "usuario_liberacao_id",
  as: "pacotes_liberados",
});
Pacote.belongsTo(Usuario, {
  foreignKey: "usuario_liberacao_id",
  as: "usuario_liberacao",
});

export default Pacote;
