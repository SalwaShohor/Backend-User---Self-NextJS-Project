-- CreateTable
CREATE TABLE "public"."credentials" (
    "id" SERIAL NOT NULL,
    "credentialID" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "counter" INTEGER DEFAULT 0,
    "user_id" INTEGER,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT DEFAULT 'user',
    "current_challenge" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."target" (
    "id" SERIAL NOT NULL,
    "ic_number" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "age" INTEGER,
    "birth_date" TIMESTAMP(3),
    "current_address" TEXT,

    CONSTRAINT "target_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credentials_user_id_idx" ON "public"."credentials"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "target_ic_number_key" ON "public"."target"("ic_number");

-- AddForeignKey
ALTER TABLE "public"."credentials" ADD CONSTRAINT "credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
