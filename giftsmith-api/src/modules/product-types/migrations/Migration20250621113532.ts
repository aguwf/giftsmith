import { Migration } from '@mikro-orm/migrations';

export class Migration20250621113532 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "custom_product" ("id" text not null, "product_id" text not null, "product_type_id" text not null, "custom_attributes" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_custom_product_deleted_at" ON "custom_product" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "custom_product_type" ("id" text not null, "name" text not null, "slug" text not null, "description" text not null, "field_schema" jsonb not null, "is_active" boolean not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_product_type_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_custom_product_type_deleted_at" ON "custom_product_type" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "custom_product" cascade;`);

    this.addSql(`drop table if exists "custom_product_type" cascade;`);
  }

}
