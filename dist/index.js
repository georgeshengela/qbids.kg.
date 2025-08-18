var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auctionBots: () => auctionBots,
  auctionBotsRelations: () => auctionBotsRelations,
  auctionStatusEnum: () => auctionStatusEnum,
  auctions: () => auctions,
  auctionsRelations: () => auctionsRelations,
  bids: () => bids,
  bidsRelations: () => bidsRelations,
  botSettings: () => botSettings,
  bots: () => bots,
  botsRelations: () => botsRelations,
  genderEnum: () => genderEnum,
  insertAuctionBotSchema: () => insertAuctionBotSchema,
  insertAuctionSchema: () => insertAuctionSchema,
  insertBidSchema: () => insertBidSchema,
  insertBotSchema: () => insertBotSchema,
  insertBotSettingsSchema: () => insertBotSettingsSchema,
  insertPrebidSchema: () => insertPrebidSchema,
  insertSettingsSchema: () => insertSettingsSchema,
  insertUserSchema: () => insertUserSchema,
  prebids: () => prebids,
  prebidsRelations: () => prebidsRelations,
  sessions: () => sessions,
  settings: () => settings,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var userRoleEnum, auctionStatusEnum, genderEnum, users, auctions, bids, prebids, botSettings, bots, auctionBots, settings, sessions, usersRelations, auctionsRelations, bidsRelations, botsRelations, auctionBotsRelations, prebidsRelations, insertUserSchema, insertAuctionSchema, insertBidSchema, insertPrebidSchema, insertBotSettingsSchema, insertBotSchema, insertSettingsSchema, insertAuctionBotSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    userRoleEnum = pgEnum("user_role", ["user", "admin"]);
    auctionStatusEnum = pgEnum("auction_status", ["upcoming", "live", "finished"]);
    genderEnum = pgEnum("gender", ["male", "female", "other"]);
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      firstName: text("first_name"),
      lastName: text("last_name"),
      username: text("username").notNull().unique(),
      email: text("email"),
      phone: text("phone"),
      password: text("password").notNull(),
      dateOfBirth: timestamp("date_of_birth"),
      gender: genderEnum("gender"),
      bidBalance: integer("bid_balance").notNull().default(0),
      // Changed from money balance to bid count
      role: userRoleEnum("role").notNull().default("user"),
      ipAddress: text("ip_address"),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    auctions = pgTable("auctions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      displayId: text("display_id").notNull(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      imageUrl: text("image_url").notNull(),
      retailPrice: decimal("retail_price", { precision: 10, scale: 2 }).notNull(),
      currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull().default("0.00"),
      bidIncrement: decimal("bid_increment", { precision: 10, scale: 2 }).notNull().default("0.01"),
      status: auctionStatusEnum("status").notNull().default("upcoming"),
      startTime: timestamp("start_time").notNull(),
      endTime: timestamp("end_time"),
      timerSeconds: integer("timer_seconds").notNull().default(10),
      winnerId: varchar("winner_id").references(() => users.id),
      isBidPackage: boolean("is_bid_package").notNull().default(false),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    bids = pgTable("bids", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      auctionId: varchar("auction_id").notNull().references(() => auctions.id, { onDelete: "cascade" }),
      userId: varchar("user_id").references(() => users.id),
      botId: varchar("bot_id").references(() => bots.id),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      isBot: boolean("is_bot").notNull().default(false),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    prebids = pgTable("prebids", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      auctionId: varchar("auction_id").notNull().references(() => auctions.id, { onDelete: "cascade" }),
      userId: varchar("user_id").notNull().references(() => users.id),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    botSettings = pgTable("bot_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      enabled: boolean("enabled").notNull().default(true),
      minDelay: integer("min_delay").notNull().default(5),
      maxDelay: integer("max_delay").notNull().default(6),
      defaultBidLimit: integer("default_bid_limit").notNull().default(0),
      // 0 = unlimited
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    bots = pgTable("bots", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      username: text("username").notNull().unique(),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    auctionBots = pgTable("auction_bots", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      auctionId: varchar("auction_id").notNull().references(() => auctions.id, { onDelete: "cascade" }),
      botId: varchar("bot_id").notNull().references(() => bots.id, { onDelete: "cascade" }),
      bidLimit: integer("bid_limit").notNull().default(0),
      // 0 = unlimited
      currentBids: integer("current_bids").notNull().default(0),
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    settings = pgTable("settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      currency: text("currency").notNull().default("\u0441\u043E\u043C"),
      currencySymbol: text("currency_symbol").notNull().default("\u0441\u043E\u043C"),
      siteName: text("site_name").notNull().default("QBIDS.KG"),
      language: text("language").notNull().default("ru"),
      headerTagline: text("header_tagline").default("\u041F\u0435\u043D\u043D\u0438-\u0430\u0443\u043A\u0446\u0438\u043E\u043D\u044B \u0432 \u041A\u044B\u0440\u0433\u044B\u0437\u0441\u0442\u0430\u043D\u0435"),
      footerDescription: text("footer_description").default("\u041F\u0435\u0440\u0432\u0430\u044F \u043F\u0435\u043D\u043D\u0438-\u0430\u0443\u043A\u0446\u0438\u043E\u043D\u043D\u0430\u044F \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0432 \u041A\u044B\u0440\u0433\u044B\u0437\u0441\u0442\u0430\u043D\u0435. \u0412\u044B\u0438\u0433\u0440\u044B\u0432\u0430\u0439\u0442\u0435 \u043F\u0440\u0435\u043C\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0442\u043E\u0432\u0430\u0440\u044B \u0437\u0430 \u043A\u043E\u043F\u0435\u0439\u043A\u0438 \u0441 \u043D\u0430\u0448\u0435\u0439 \u0447\u0435\u0441\u0442\u043D\u043E\u0439 \u0438 \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0439 \u0441\u0438\u0441\u0442\u0435\u043C\u043E\u0439 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u043E\u0432."),
      contactAddress: text("contact_address").default("\u0433. \u0411\u0438\u0448\u043A\u0435\u043A, \u0443\u043B. \u0427\u0443\u0439 154"),
      contactPhone: text("contact_phone").default("+996 (555) 123-456"),
      contactEmail: text("contact_email").default("info@qbids.kg"),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    usersRelations = relations(users, ({ many }) => ({
      bids: many(bids),
      prebids: many(prebids),
      wonAuctions: many(auctions)
    }));
    auctionsRelations = relations(auctions, ({ one, many }) => ({
      winner: one(users, {
        fields: [auctions.winnerId],
        references: [users.id]
      }),
      bids: many(bids),
      prebids: many(prebids)
    }));
    bidsRelations = relations(bids, ({ one }) => ({
      auction: one(auctions, {
        fields: [bids.auctionId],
        references: [auctions.id]
      }),
      user: one(users, {
        fields: [bids.userId],
        references: [users.id]
      }),
      bot: one(bots, {
        fields: [bids.botId],
        references: [bots.id]
      })
    }));
    botsRelations = relations(bots, ({ many }) => ({
      bids: many(bids),
      auctionBots: many(auctionBots)
    }));
    auctionBotsRelations = relations(auctionBots, ({ one }) => ({
      auction: one(auctions, {
        fields: [auctionBots.auctionId],
        references: [auctions.id]
      }),
      bot: one(bots, {
        fields: [auctionBots.botId],
        references: [bots.id]
      })
    }));
    prebidsRelations = relations(prebids, ({ one }) => ({
      auction: one(auctions, {
        fields: [prebids.auctionId],
        references: [auctions.id]
      }),
      user: one(users, {
        fields: [prebids.userId],
        references: [users.id]
      })
    }));
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true
    });
    insertAuctionSchema = createInsertSchema(auctions).omit({
      id: true,
      createdAt: true,
      winnerId: true,
      endTime: true,
      displayId: true
    });
    insertBidSchema = createInsertSchema(bids).omit({
      id: true,
      createdAt: true
    });
    insertPrebidSchema = createInsertSchema(prebids).omit({
      id: true,
      createdAt: true
    });
    insertBotSettingsSchema = createInsertSchema(botSettings).omit({
      id: true,
      updatedAt: true
    });
    insertBotSchema = createInsertSchema(bots).omit({
      id: true,
      createdAt: true
    });
    insertSettingsSchema = createInsertSchema(settings).omit({
      id: true,
      updatedAt: true
    });
    insertAuctionBotSchema = createInsertSchema(auctionBots).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/db.ts
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
var Pool, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    ({ Pool } = pg);
    dotenv.config();
    if (!process.env.DATABASE_URL) {
      console.error("Available environment variables:", Object.keys(process.env));
      throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/storage.ts
import { eq, desc, and, sql as sql2 } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || void 0;
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || void 0;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user || void 0;
      }
      async getUserByPhone(phone) {
        const [user] = await db.select().from(users).where(eq(users.phone, phone));
        return user || void 0;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateUser(id, updateData) {
        const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
        return user;
      }
      async deleteUser(id) {
        await db.update(auctions).set({ winnerId: null }).where(eq(auctions.winnerId, id));
        await db.delete(prebids).where(eq(prebids.userId, id));
        await db.delete(bids).where(eq(bids.userId, id));
        await db.delete(users).where(eq(users.id, id));
      }
      async updateUserBidBalance(userId, amount) {
        await db.update(users).set({ bidBalance: sql2`${users.bidBalance} - ${amount}` }).where(eq(users.id, userId));
      }
      async updateUserIpAddress(userId, ipAddress) {
        await db.update(users).set({ ipAddress }).where(eq(users.id, userId));
      }
      async getUserWonAuctions(userId) {
        const wonAuctions = await db.select().from(auctions).where(and(eq(auctions.winnerId, userId), eq(auctions.status, "finished"))).orderBy(desc(auctions.endTime));
        const createSlug = (title, displayId) => {
          const baseSlug = title.toLowerCase().replace(/[^a-z0-9а-я\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim().substring(0, 35);
          const cleanDisplayId = displayId.replace(/[/\\]/g, "-").toLowerCase();
          return `${baseSlug}-${cleanDisplayId}`;
        };
        return wonAuctions.map((auction) => ({
          ...auction,
          wonAt: auction.endTime ? auction.endTime.toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
          finalPrice: parseInt(auction.currentPrice),
          slug: createSlug(auction.title, auction.displayId)
        }));
      }
      async getUserRecentBids(userId, limit = 20) {
        const userBids = await db.select({
          id: bids.id,
          amount: bids.amount,
          auctionId: bids.auctionId,
          userId: bids.userId,
          botId: bids.botId,
          isBot: bids.isBot,
          createdAt: bids.createdAt,
          auction: {
            id: auctions.id,
            title: auctions.title,
            description: auctions.description,
            imageUrl: auctions.imageUrl,
            retailPrice: auctions.retailPrice,
            currentPrice: auctions.currentPrice,
            bidIncrement: auctions.bidIncrement,
            startTime: auctions.startTime,
            endTime: auctions.endTime,
            status: auctions.status,
            winnerId: auctions.winnerId,
            createdAt: auctions.createdAt,
            displayId: auctions.displayId,
            timerSeconds: auctions.timerSeconds
          }
        }).from(bids).innerJoin(auctions, eq(bids.auctionId, auctions.id)).where(eq(bids.userId, userId)).orderBy(desc(bids.createdAt)).limit(limit);
        return userBids.map((bid) => ({
          id: bid.id,
          amount: bid.amount,
          auctionId: bid.auctionId,
          userId: bid.userId,
          botId: bid.botId,
          isBot: bid.isBot,
          createdAt: bid.createdAt,
          auction: bid.auction
        }));
      }
      async getAuction(id) {
        const [auction] = await db.select().from(auctions).where(eq(auctions.id, id));
        return auction || void 0;
      }
      async getAllAuctions() {
        return await db.select().from(auctions).orderBy(desc(auctions.createdAt));
      }
      async getAuctionsByStatus(status) {
        if (status === "finished") {
          const results = await db.select({
            id: auctions.id,
            title: auctions.title,
            description: auctions.description,
            imageUrl: auctions.imageUrl,
            retailPrice: auctions.retailPrice,
            currentPrice: auctions.currentPrice,
            bidIncrement: auctions.bidIncrement,
            startTime: auctions.startTime,
            endTime: auctions.endTime,
            status: auctions.status,
            winnerId: auctions.winnerId,
            createdAt: auctions.createdAt,
            displayId: auctions.displayId,
            timerSeconds: auctions.timerSeconds,
            winner: {
              id: users.id,
              username: users.username,
              firstName: users.firstName,
              lastName: users.lastName,
              email: users.email,
              phone: users.phone,
              bidBalance: users.bidBalance,
              role: users.role,
              password: users.password,
              ipAddress: users.ipAddress,
              createdAt: users.createdAt
            }
          }).from(auctions).leftJoin(users, eq(auctions.winnerId, users.id)).where(eq(auctions.status, status)).orderBy(desc(auctions.createdAt));
          return results.map((result) => ({
            ...result,
            winner: result.winner && result.winner.id ? result.winner : void 0
          }));
        }
        return await db.select().from(auctions).where(eq(auctions.status, status)).orderBy(desc(auctions.createdAt));
      }
      async createAuction(insertAuction) {
        const randomDigits = Math.floor(1e3 + Math.random() * 9e3);
        const displayId = `QB/${randomDigits}`;
        const [auction] = await db.insert(auctions).values({
          ...insertAuction,
          displayId
        }).returning();
        return auction;
      }
      async updateAuction(id, auctionData) {
        const [auction] = await db.update(auctions).set(auctionData).where(eq(auctions.id, id)).returning();
        return auction;
      }
      async deleteAuction(id) {
        await db.delete(auctions).where(eq(auctions.id, id));
      }
      async updateAuctionStatus(id, status) {
        await db.update(auctions).set({ status, ...status === "finished" ? { endTime: /* @__PURE__ */ new Date() } : {} }).where(eq(auctions.id, id));
      }
      async updateAuctionPrice(id, price) {
        await db.update(auctions).set({ currentPrice: price }).where(eq(auctions.id, id));
      }
      async updateAuctionWinner(id, winnerId) {
        await db.update(auctions).set({ winnerId }).where(eq(auctions.id, id));
      }
      async getBidsForAuction(auctionId) {
        const actualBids = await db.select({
          id: bids.id,
          auctionId: bids.auctionId,
          userId: bids.userId,
          botId: bids.botId,
          amount: bids.amount,
          isBot: bids.isBot,
          createdAt: bids.createdAt,
          isPrebid: sql2`false`,
          user: {
            id: users.id,
            username: users.username
          },
          botName: sql2`CASE WHEN ${bids.isBot} = true THEN ${bots.username} ELSE NULL END`
        }).from(bids).leftJoin(users, eq(bids.userId, users.id)).leftJoin(bots, eq(bids.botId, bots.id)).where(eq(bids.auctionId, auctionId));
        const prebidsRaw = await db.select({
          id: prebids.id,
          auctionId: prebids.auctionId,
          userId: prebids.userId,
          createdAt: prebids.createdAt,
          user: {
            id: users.id,
            username: users.username
          }
        }).from(prebids).leftJoin(users, eq(prebids.userId, users.id)).where(eq(prebids.auctionId, auctionId)).orderBy(prebids.createdAt);
        const auction = await this.getAuction(auctionId);
        const currentPrice = parseFloat(auction?.currentPrice || "0.00");
        const increment = parseFloat(auction?.bidIncrement || "0.01");
        const basePrice = Math.max(0, currentPrice - increment * prebidsRaw.length);
        const prebidsData = prebidsRaw.map((prebid, index2) => ({
          id: prebid.id,
          auctionId: prebid.auctionId,
          userId: prebid.userId,
          botId: null,
          amount: (basePrice + increment * (index2 + 1)).toFixed(2),
          isBot: false,
          createdAt: prebid.createdAt,
          isPrebid: true,
          user: prebid.user,
          botName: null
        }));
        const allBids = [...actualBids, ...prebidsData];
        return allBids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      async getRecentBids(limit = 10) {
        const results = await db.select({
          id: bids.id,
          auctionId: bids.auctionId,
          userId: bids.userId,
          botId: bids.botId,
          amount: bids.amount,
          isBot: bids.isBot,
          createdAt: bids.createdAt,
          auction: auctions,
          user: {
            id: users.id,
            username: users.username
          },
          botName: sql2`CASE WHEN ${bids.isBot} = true THEN ${bots.username} ELSE NULL END`
        }).from(bids).innerJoin(auctions, eq(bids.auctionId, auctions.id)).leftJoin(users, eq(bids.userId, users.id)).leftJoin(bots, eq(bids.botId, bots.id)).orderBy(desc(bids.createdAt)).limit(limit);
        return results.map((result) => ({
          ...result,
          user: result.user?.id ? result.user : void 0
        }));
      }
      async getUserBids(userId, limit = 50) {
        const results = await db.select({
          id: bids.id,
          auctionId: bids.auctionId,
          userId: bids.userId,
          botId: bids.botId,
          amount: bids.amount,
          isBot: bids.isBot,
          createdAt: bids.createdAt,
          auction: auctions
        }).from(bids).innerJoin(auctions, eq(bids.auctionId, auctions.id)).where(and(eq(bids.userId, userId), eq(bids.isBot, false))).orderBy(desc(bids.createdAt)).limit(limit);
        return results;
      }
      async getUserPrebids(userId, limit = 50) {
        const results = await db.select({
          id: prebids.id,
          auctionId: prebids.auctionId,
          userId: prebids.userId,
          createdAt: prebids.createdAt,
          auction: auctions
        }).from(prebids).innerJoin(auctions, eq(prebids.auctionId, auctions.id)).where(eq(prebids.userId, userId)).orderBy(desc(prebids.createdAt)).limit(limit);
        return results;
      }
      async getLastBotBidForAuction(auctionId) {
        const [lastBotBid] = await db.select().from(bids).where(and(eq(bids.auctionId, auctionId), eq(bids.isBot, true))).orderBy(desc(bids.createdAt)).limit(1);
        return lastBotBid || void 0;
      }
      async createBid(insertBid) {
        const [bid] = await db.insert(bids).values(insertBid).returning();
        return bid;
      }
      async getPrebidsForAuction(auctionId) {
        return await db.select().from(prebids).where(eq(prebids.auctionId, auctionId));
      }
      async createPrebid(insertPrebid) {
        const [prebid] = await db.insert(prebids).values(insertPrebid).returning();
        return prebid;
      }
      async getBotSettings() {
        const [settings2] = await db.select().from(botSettings).limit(1);
        if (!settings2) {
          const [newSettings] = await db.insert(botSettings).values({}).returning();
          return newSettings;
        }
        return settings2;
      }
      async updateBotSettings(settings2) {
        const existing = await this.getBotSettings();
        if (!existing) {
          const [newSettings] = await db.insert(botSettings).values(settings2).returning();
          return newSettings;
        }
        const [updated] = await db.update(botSettings).set({ ...settings2, updatedAt: /* @__PURE__ */ new Date() }).where(eq(botSettings.id, existing.id)).returning();
        return updated;
      }
      async getUserStats(userId) {
        const [activeBidsResult] = await db.select({ count: sql2`count(*)` }).from(bids).innerJoin(auctions, eq(bids.auctionId, auctions.id)).where(and(eq(bids.userId, userId), eq(auctions.status, "live")));
        const [wonAuctionsResult] = await db.select({ count: sql2`count(*)` }).from(auctions).where(eq(auctions.winnerId, userId));
        const [totalBidsResult] = await db.select({ count: sql2`count(*)` }).from(bids).where(eq(bids.userId, userId));
        const [totalPrebidsResult] = await db.select({ count: sql2`count(*)` }).from(prebids).where(eq(prebids.userId, userId));
        const totalSpent = (((totalBidsResult?.count || 0) + (totalPrebidsResult?.count || 0)) * 0.01).toFixed(2);
        const [activePrebidsResult] = await db.select({ count: sql2`count(*)` }).from(prebids).innerJoin(auctions, eq(prebids.auctionId, auctions.id)).where(and(eq(prebids.userId, userId), eq(auctions.status, "upcoming")));
        return {
          activeBids: activeBidsResult?.count || 0,
          wonAuctions: wonAuctionsResult?.count || 0,
          totalSpent,
          activePrebids: activePrebidsResult?.count || 0
        };
      }
      async getUsersWithStats(page, limit, search) {
        const offset = (page - 1) * limit;
        let searchCondition = sql2`true`;
        if (search) {
          const searchTerm = `%${search.toLowerCase()}%`;
          searchCondition = sql2`(
        LOWER(${users.username}) LIKE ${searchTerm} OR 
        LOWER(${users.firstName}) LIKE ${searchTerm} OR 
        LOWER(${users.lastName}) LIKE ${searchTerm} OR
        LOWER(${users.email}) LIKE ${searchTerm}
      )`;
        }
        const [totalResult] = await db.select({ count: sql2`count(*)` }).from(users).where(searchCondition);
        const total = totalResult?.count || 0;
        const totalPages = Math.ceil(total / limit);
        const usersWithStats = await db.execute(sql2`
      SELECT 
        u.id,
        u.username,
        u.first_name as "firstName",
        u.last_name as "lastName", 
        u.email,
        u.phone,
        u.password,
        u.bid_balance as "bidBalance",
        u.role,
        u.ip_address as "ipAddress",
        u.created_at as "createdAt",
        NULL as "lastLogin",
        COALESCE((SELECT count(*)::int FROM bids WHERE user_id = u.id AND is_bot = false), 0) as "totalBids",
        COALESCE((SELECT count(*)::int FROM auctions WHERE winner_id = u.id), 0) as "wonAuctions", 
        COALESCE((SELECT (COUNT(*) * 0.01)::decimal FROM bids WHERE user_id = u.id AND is_bot = false), 0) + 
        COALESCE((SELECT (COUNT(*) * 0.01)::decimal FROM prebids WHERE user_id = u.id), 0) as "totalSpent"
      FROM users u
      WHERE ${searchCondition}
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
        return {
          users: usersWithStats.rows,
          total,
          page,
          limit,
          totalPages
        };
      }
      // Get today's registration count
      async getTodayRegistrations() {
        const today = /* @__PURE__ */ new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const [result] = await db.select({ count: sql2`count(*)` }).from(users).where(and(
          sql2`${users.createdAt} >= ${startOfDay.toISOString()}`,
          sql2`${users.createdAt} < ${endOfDay.toISOString()}`
        ));
        return result?.count || 0;
      }
      // Get user auction activity (bids and prebids)
      async getUserAuctionActivity(userId) {
        const activeBidsResult = await db.select({
          id: sql2`MIN(${bids.id})`,
          auctionId: bids.auctionId,
          auctionTitle: auctions.title,
          currentPrice: auctions.currentPrice,
          bidAmount: sql2`'0.01'`,
          // Each bid costs 0.01 som
          createdAt: sql2`MAX(${bids.createdAt})`,
          status: auctions.status,
          bidCount: sql2`COUNT(*)`
        }).from(bids).innerJoin(auctions, eq(bids.auctionId, auctions.id)).where(eq(bids.userId, userId)).groupBy(bids.auctionId, auctions.title, auctions.currentPrice, auctions.status).orderBy(sql2`MAX(${bids.createdAt}) DESC`).limit(20);
        const prebidsResult = await db.select({
          id: prebids.id,
          auctionId: prebids.auctionId,
          auctionTitle: auctions.title,
          amount: sql2`'0.01'`,
          // Prebids always cost 1 bid (0.01 som)
          createdAt: prebids.createdAt,
          status: auctions.status
        }).from(prebids).innerJoin(auctions, eq(prebids.auctionId, auctions.id)).where(eq(prebids.userId, userId)).orderBy(desc(prebids.createdAt)).limit(20);
        const wonAuctionsResult = await db.select({
          id: auctions.id,
          title: auctions.title,
          finalPrice: auctions.currentPrice,
          endTime: auctions.endTime
        }).from(auctions).where(eq(auctions.winnerId, userId)).orderBy(desc(auctions.endTime)).limit(10);
        return {
          activeBids: activeBidsResult,
          prebids: prebidsResult,
          wonAuctions: wonAuctionsResult
        };
      }
      // Bot management methods
      async getAllBots() {
        return await db.select().from(bots).orderBy(desc(bots.createdAt));
      }
      async getBot(id) {
        const [bot] = await db.select().from(bots).where(eq(bots.id, id));
        return bot || void 0;
      }
      async createBot(bot) {
        const [newBot] = await db.insert(bots).values(bot).returning();
        return newBot;
      }
      async updateBot(id, bot) {
        const [updated] = await db.update(bots).set(bot).where(eq(bots.id, id)).returning();
        return updated;
      }
      async deleteBot(id) {
        await db.delete(bots).where(eq(bots.id, id));
      }
      // Auction bot methods
      async getAuctionBots(auctionId) {
        const auctionBotsList = await db.select().from(auctionBots).where(eq(auctionBots.auctionId, auctionId));
        const result = [];
        for (const auctionBot of auctionBotsList) {
          const [bot] = await db.select().from(bots).where(eq(bots.id, auctionBot.botId));
          if (bot) {
            result.push({ ...auctionBot, bot });
          }
        }
        return result;
      }
      async addBotToAuction(auctionBot) {
        const [newAuctionBot] = await db.insert(auctionBots).values(auctionBot).returning();
        return newAuctionBot;
      }
      async removeBotFromAuction(auctionId, botId) {
        await db.delete(auctionBots).where(and(eq(auctionBots.auctionId, auctionId), eq(auctionBots.botId, botId)));
      }
      async updateAuctionBotBidCount(auctionId, botId) {
        await db.update(auctionBots).set({ currentBids: sql2`${auctionBots.currentBids} + 1` }).where(and(eq(auctionBots.auctionId, auctionId), eq(auctionBots.botId, botId)));
      }
      // Get live auctions for bot status checking
      async getLiveAuctions() {
        return await db.select().from(auctions).where(eq(auctions.status, "live"));
      }
      // Get all auction-bot associations for a specific bot
      async getBotAuctions(botId) {
        return await db.select().from(auctionBots).where(eq(auctionBots.botId, botId));
      }
      // Get detailed auction statistics with bid breakdown
      async getAuctionDetailedStats(auctionId) {
        const allBids = await this.getBidsForAuction(auctionId);
        const totalBids = allBids.length;
        const botBidsCount = allBids.filter((bid) => bid.isBot).length;
        const nonBotBidsWithUsers = [];
        for (const bid of allBids.filter((b) => !b.isBot && b.userId)) {
          const user = await this.getUser(bid.userId);
          if (user) {
            nonBotBidsWithUsers.push({ bid, user });
          }
        }
        const userBidsCount = nonBotBidsWithUsers.filter((item) => item.user.role === "user").length;
        const adminBidsCount = nonBotBidsWithUsers.filter((item) => item.user.role === "admin").length;
        const bidDetails = [];
        for (const bid of allBids) {
          if (bid.isBot) {
            bidDetails.push({
              id: bid.id,
              userId: bid.userId || "",
              userName: bid.botName || "\u0411\u043E\u0442",
              userRole: "bot",
              bidAmount: bid.amount,
              createdAt: bid.createdAt.toISOString(),
              isBot: true
            });
          } else if (bid.userId) {
            const user = await this.getUser(bid.userId);
            bidDetails.push({
              id: bid.id,
              userId: bid.userId,
              userName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439",
              userRole: user?.role || "user",
              bidAmount: bid.amount,
              createdAt: bid.createdAt.toISOString(),
              isBot: false
            });
          }
        }
        return {
          totalBids,
          botBids: botBidsCount,
          userBids: userBidsCount,
          adminBids: adminBidsCount,
          bids: bidDetails
          // Already in correct order (latest first from getBidsForAuction)
        };
      }
      // Settings methods
      async getSettings() {
        const [settingsRecord] = await db.select().from(settings).limit(1);
        if (!settingsRecord) {
          const [newSettings] = await db.insert(settings).values({}).returning();
          return newSettings;
        }
        return settingsRecord;
      }
      async updateSettings(settingsUpdate) {
        const existing = await this.getSettings();
        if (!existing) {
          const [newSettings] = await db.insert(settings).values(settingsUpdate).returning();
          return newSettings;
        }
        const [updated] = await db.update(settings).set({ ...settingsUpdate, updatedAt: /* @__PURE__ */ new Date() }).where(eq(settings.id, existing.id)).returning();
        return updated;
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/services/bot-service.ts
var BotService, botService;
var init_bot_service = __esm({
  "server/services/bot-service.ts"() {
    "use strict";
    init_storage();
    BotService = class {
      // Bot CRUD operations
      async getAllBots() {
        return await storage.getAllBots();
      }
      async getBot(id) {
        const bot = await storage.getBot(id);
        return bot || null;
      }
      async createBot(botData) {
        return await storage.createBot(botData);
      }
      async updateBot(id, botData) {
        return await storage.updateBot(id, botData);
      }
      async deleteBot(id) {
        await storage.deleteBot(id);
      }
      // Auction bot management
      async addBotToAuction(auctionId, botId, bidLimit = 0) {
        const auctionBot = {
          auctionId,
          botId,
          bidLimit,
          currentBids: 0,
          isActive: true
        };
        await storage.addBotToAuction(auctionBot);
      }
      async removeBotFromAuction(auctionId, botId) {
        await storage.removeBotFromAuction(auctionId, botId);
      }
      async getAuctionBots(auctionId) {
        return await storage.getAuctionBots(auctionId);
      }
      async getBotsWithAuctionStatus() {
        const bots2 = await storage.getAllBots();
        const result = [];
        for (const bot of bots2) {
          const auctionBots2 = await storage.getBotAuctions(bot.id);
          const activeAuctions = auctionBots2.filter((ab) => ab.isActive);
          result.push({
            id: bot.id,
            firstName: bot.firstName,
            lastName: bot.lastName,
            isEnabled: bot.isActive,
            activeAuctions: activeAuctions.length,
            auctionIds: activeAuctions.map((ab) => ab.auctionId)
          });
        }
        return result;
      }
      // Bot bidding logic with simple rotation
      currentBotIndex = /* @__PURE__ */ new Map();
      lastBidTime = /* @__PURE__ */ new Map();
      auctionLocks = /* @__PURE__ */ new Map();
      async checkAndPlaceBotBid(auctionId, currentTimer) {
        if (currentTimer !== 4 && currentTimer !== 2) {
          return;
        }
        if (this.auctionLocks.get(auctionId)) {
          return;
        }
        this.auctionLocks.set(auctionId, true);
        try {
          const now = Date.now();
          const lastBid = this.lastBidTime.get(auctionId) || 0;
          if (now - lastBid < 1e3) {
            return;
          }
          const auctionBots2 = await this.getAuctionBots(auctionId);
          const activeBots = auctionBots2.filter(
            (ab) => ab.isActive && ab.bot.isActive && (ab.bidLimit === 0 || ab.currentBids < ab.bidLimit)
          ).sort((a, b) => a.bidLimit - b.bidLimit);
          const totalPossibleBids = activeBots.reduce((sum, bot) => sum + (bot.bidLimit - bot.currentBids), 0);
          console.log(`Auction ${auctionId}: ${activeBots.length} active bots remaining with ${totalPossibleBids} total bids left: ${activeBots.map((ab) => `${ab.bot.username}(${ab.currentBids}/${ab.bidLimit})`).join(", ")}`);
          if (activeBots.length === 0) {
            console.log(`No active bots for auction ${auctionId}`);
            return;
          }
          if (activeBots.length === 1) {
            console.log(`Only one bot (${activeBots[0].bot.username}) remains active with ${activeBots[0].bidLimit - activeBots[0].currentBids} bids left. Letting them win instead of bidding against themselves.`);
            return;
          }
          if (currentTimer === 2 && activeBots.length > 1) {
            console.log(`Timer at 2 seconds with ${activeBots.length} active bots - forcing bid to continue competition`);
          }
          let currentIndex = this.currentBotIndex.get(auctionId) || 0;
          const selectedBot = activeBots[currentIndex % activeBots.length];
          this.currentBotIndex.set(auctionId, (currentIndex + 1) % activeBots.length);
          this.lastBidTime.set(auctionId, now);
          console.log(`Bot ${selectedBot.bot.username} placing bid (${selectedBot.currentBids + 1}/${selectedBot.bidLimit}) at timer ${currentTimer}`);
          const { auctionService: auctionService2 } = await Promise.resolve().then(() => (init_auction_service(), auction_service_exports));
          await auctionService2.placeBotBid(auctionId, selectedBot.botId);
        } finally {
          this.auctionLocks.set(auctionId, false);
        }
      }
      async startBotsForAuction(auctionId) {
        this.currentBotIndex.set(auctionId, 0);
        this.lastBidTime.set(auctionId, 0);
        this.auctionLocks.set(auctionId, false);
      }
      async stopBotsForAuction(auctionId) {
        this.currentBotIndex.delete(auctionId);
        this.lastBidTime.delete(auctionId);
        this.auctionLocks.delete(auctionId);
      }
    };
    botService = new BotService();
  }
});

// server/socket.ts
function setSocketIO(socketServer) {
  io = socketServer;
}
function broadcastAuctionUpdate(auctionId, data) {
  if (io) {
    io.to(`auction-${auctionId}`).emit("auctionUpdate", data);
    io.emit("auctionUpdate", data);
  }
}
function broadcastBidBalanceUpdate(userId, newBalance) {
  if (io) {
    io.emit("bidBalanceUpdate", { userId, newBalance });
  }
}
var io;
var init_socket = __esm({
  "server/socket.ts"() {
    "use strict";
    io = null;
  }
});

// server/services/timer-service.ts
var TimerService, timerService;
var init_timer_service = __esm({
  "server/services/timer-service.ts"() {
    "use strict";
    init_auction_service();
    init_bot_service();
    init_socket();
    TimerService = class {
      timers = /* @__PURE__ */ new Map();
      startAuctionTimer(auctionId, seconds = 10) {
        this.stopAuctionTimer(auctionId);
        const timer = {
          auctionId,
          timeLeft: seconds,
          interval: setInterval(async () => {
            timer.timeLeft--;
            await botService.checkAndPlaceBotBid(auctionId, timer.timeLeft);
            broadcastAuctionUpdate(auctionId, {
              type: "timer",
              auctionId,
              timeLeft: timer.timeLeft
            });
            if (timer.timeLeft <= 0) {
              this.stopAuctionTimer(auctionId);
              await botService.stopBotsForAuction(auctionId);
              auctionService.endAuction(auctionId);
            }
          }, 1e3)
        };
        this.timers.set(auctionId, timer);
      }
      resetAuctionTimer(auctionId, seconds = 10) {
        const timer = this.timers.get(auctionId);
        if (timer) {
          timer.timeLeft = seconds;
        } else {
          this.startAuctionTimer(auctionId, seconds);
        }
      }
      stopAuctionTimer(auctionId) {
        const timer = this.timers.get(auctionId);
        if (timer) {
          clearInterval(timer.interval);
          this.timers.delete(auctionId);
        }
      }
      getTimeLeft(auctionId) {
        const timer = this.timers.get(auctionId);
        return timer ? timer.timeLeft : 0;
      }
      getAllTimers() {
        const result = {};
        this.timers.forEach((timer, auctionId) => {
          result[auctionId] = timer.timeLeft;
        });
        return result;
      }
    };
    timerService = new TimerService();
  }
});

// server/services/auction-service.ts
var auction_service_exports = {};
__export(auction_service_exports, {
  AuctionService: () => AuctionService,
  auctionService: () => auctionService
});
var AuctionService, auctionService;
var init_auction_service = __esm({
  "server/services/auction-service.ts"() {
    "use strict";
    init_storage();
    init_timer_service();
    init_bot_service();
    init_socket();
    AuctionService = class {
      async startAuction(auctionId) {
        await storage.updateAuctionStatus(auctionId, "live");
        await this.convertPrebidsToBids(auctionId);
        timerService.startAuctionTimer(auctionId);
        botService.startBotsForAuction(auctionId);
      }
      async endAuction(auctionId) {
        const auction = await storage.getAuction(auctionId);
        if (!auction) return;
        await storage.updateAuctionStatus(auctionId, "finished");
        const bids2 = await storage.getBidsForAuction(auctionId);
        if (bids2.length > 0) {
          if (bids2[0].userId) {
            await storage.updateAuctionWinner(auctionId, bids2[0].userId);
          }
          console.log(`Auction ${auctionId} ended. Winner: ${bids2[0].userId ? "User" : "Bot"} with bid ${bids2[0].amount}`);
        } else {
          const prebids2 = await storage.getPrebidsForAuction(auctionId);
          if (prebids2.length > 0) {
            const firstPrebidder = prebids2[0];
            await storage.updateAuctionWinner(auctionId, firstPrebidder.userId);
            console.log(`Auction ${auctionId} ended with no bids. Winner: Prebidder ${firstPrebidder.userId}`);
          }
        }
        timerService.stopAuctionTimer(auctionId);
        botService.stopBotsForAuction(auctionId);
        const updatedAuction = await storage.getAuction(auctionId);
        if (updatedAuction) {
          broadcastAuctionUpdate(auctionId, {
            auction: updatedAuction,
            bids: bids2.slice(0, 5)
          });
        }
      }
      async placeBid(auctionId, userId) {
        const auction = await storage.getAuction(auctionId);
        if (!auction || auction.status !== "live") return false;
        const user = await storage.getUser(userId);
        if (!user) return false;
        const newPrice = (parseFloat(auction.currentPrice) + parseFloat(auction.bidIncrement)).toFixed(2);
        if (user.bidBalance < 1) {
          return false;
        }
        const bid = {
          auctionId,
          userId,
          amount: newPrice,
          isBot: false
        };
        await storage.createBid(bid);
        await storage.updateAuctionPrice(auctionId, newPrice);
        await storage.updateUserBidBalance(userId, 1);
        const updatedUser = await storage.getUser(userId);
        if (updatedUser) {
          broadcastBidBalanceUpdate(userId, updatedUser.bidBalance);
        }
        timerService.resetAuctionTimer(auctionId);
        const updatedBids = await storage.getBidsForAuction(auctionId);
        const updatedAuction = await storage.getAuction(auctionId);
        if (updatedAuction) {
          broadcastAuctionUpdate(auctionId, {
            auction: updatedAuction,
            bids: updatedBids.slice(0, 5)
          });
        }
        return true;
      }
      async placeBotBid(auctionId, botId) {
        const auction = await storage.getAuction(auctionId);
        if (!auction || auction.status !== "live") return false;
        const newPrice = (parseFloat(auction.currentPrice) + parseFloat(auction.bidIncrement)).toFixed(2);
        const bid = {
          auctionId,
          userId: null,
          botId,
          amount: newPrice,
          isBot: true
        };
        await storage.createBid(bid);
        await storage.updateAuctionPrice(auctionId, newPrice);
        await storage.updateAuctionBotBidCount(auctionId, botId);
        timerService.resetAuctionTimer(auctionId);
        const updatedBids = await storage.getBidsForAuction(auctionId);
        const updatedAuction = await storage.getAuction(auctionId);
        if (updatedAuction) {
          broadcastAuctionUpdate(auctionId, {
            auction: updatedAuction,
            bids: updatedBids.slice(0, 5)
          });
        }
        return true;
      }
      async placePrebid(auctionId, userId) {
        const auction = await storage.getAuction(auctionId);
        if (!auction || auction.status !== "upcoming") {
          return { success: false, error: "\u0410\u0443\u043A\u0446\u0438\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0438\u043B\u0438 \u0443\u0436\u0435 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u0438\u0442\u0441\u044F \u043A \u0441\u0442\u0430\u0440\u0442\u0443" };
        }
        const user = await storage.getUser(userId);
        if (!user) {
          return { success: false, error: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" };
        }
        if (user.bidBalance < 1) {
          return { success: false, error: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0441\u0442\u0430\u0432\u043E\u043A \u0434\u043B\u044F \u0440\u0430\u0437\u043C\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043A\u0438" };
        }
        const existingPrebids = await storage.getPrebidsForAuction(auctionId);
        const userAlreadyHasPrebid = existingPrebids.some((prebid) => prebid.userId === userId);
        if (userAlreadyHasPrebid) {
          return { success: false, error: "\u0412\u044B \u043D\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u0435\u0440\u0435\u0431\u0438\u0442\u044C \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043A\u0443" };
        }
        await storage.updateUserBidBalance(userId, 1);
        await storage.createPrebid({ auctionId, userId });
        const updatedUser = await storage.getUser(userId);
        if (updatedUser) {
          broadcastBidBalanceUpdate(userId, updatedUser.bidBalance);
        }
        const updatedPrebids = await storage.getPrebidsForAuction(auctionId);
        const originalBasePrice = 0;
        const increment = parseFloat(auction.bidIncrement);
        const newPrice = (originalBasePrice + increment * updatedPrebids.length).toFixed(2);
        await storage.updateAuctionPrice(auctionId, newPrice);
        return { success: true };
      }
      async checkUpcomingAuctions() {
        const upcomingAuctions = await storage.getAuctionsByStatus("upcoming");
        const now = /* @__PURE__ */ new Date();
        for (const auction of upcomingAuctions) {
          if (auction.startTime <= now) {
            await this.startAuction(auction.id);
          }
        }
      }
      // Restart all live auctions after server restart
      async restartLiveAuctions() {
        const liveAuctions = await storage.getAuctionsByStatus("live");
        for (const auction of liveAuctions) {
          console.log(`Restarting live auction: ${auction.title} (${auction.id})`);
          timerService.startAuctionTimer(auction.id);
          botService.startBotsForAuction(auction.id);
        }
        console.log(`Restarted ${liveAuctions.length} live auctions`);
      }
      async convertPrebidsToBids(auctionId) {
        const auction = await storage.getAuction(auctionId);
        if (!auction) return;
        const prebids2 = await storage.getPrebidsForAuction(auctionId);
        if (prebids2.length > 0) {
          const basePrice = parseFloat(auction.currentPrice);
          const increment = parseFloat(auction.bidIncrement);
          for (let i = 0; i < prebids2.length; i++) {
            const prebid = prebids2[i];
            const bidAmount = (basePrice + increment * (i + 1)).toFixed(2);
            const bid = {
              auctionId,
              userId: prebid.userId,
              amount: bidAmount,
              isBot: false
            };
            await storage.createBid(bid);
          }
          const finalPrice = (basePrice + increment * prebids2.length).toFixed(2);
          await storage.updateAuctionPrice(auctionId, finalPrice);
          console.log(`Converted ${prebids2.length} prebids to bids for auction ${auctionId}. Final price: ${finalPrice}`);
        }
      }
    };
    auctionService = new AuctionService();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import bcrypt from "bcrypt";

// server/session.ts
init_db();
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
var PgSession = connectPgSimple(session);
function createSessionMiddleware() {
  return session({
    store: new PgSession({
      pool,
      tableName: "sessions",
      createTableIfMissing: false
      // Table already exists in schema
    }),
    secret: process.env.SESSION_SECRET || "fallback-secret-for-dev-only",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE === "true",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
    }
  });
}

// server/routes.ts
init_storage();
init_auction_service();
init_timer_service();
init_bot_service();
init_socket();
init_schema();
import { z } from "zod";
var errorMessages = {
  ru: {
    invalidCredentials: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435",
    unauthorized: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D",
    userAlreadyExists: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",
    registrationError: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438",
    invalidData: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435",
    userNotFound: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"
  },
  en: {
    invalidCredentials: "Invalid credentials",
    unauthorized: "Unauthorized",
    userAlreadyExists: "User already exists",
    registrationError: "Registration error",
    invalidData: "Invalid data",
    userNotFound: "User not found"
  },
  ka: {
    invalidCredentials: "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E1\u10D0\u10D5\u10D8\u10E1\u10D4 \u10DB\u10DD\u10DC\u10D0\u10EA\u10D4\u10DB\u10D4\u10D1\u10D8",
    unauthorized: "\u10D0\u10E0\u10D0\u10D0\u10D5\u10E2\u10DD\u10E0\u10D8\u10D6\u10D4\u10D1\u10E3\u10DA\u10D8",
    userAlreadyExists: "\u10DB\u10DD\u10DB\u10EE\u10DB\u10D0\u10E0\u10D4\u10D1\u10D4\u10DA\u10D8 \u10E3\u10D9\u10D5\u10D4 \u10D0\u10E0\u10E1\u10D4\u10D1\u10DD\u10D1\u10E1",
    registrationError: "\u10E0\u10D4\u10D2\u10D8\u10E1\u10E2\u10E0\u10D0\u10EA\u10D8\u10D8\u10E1 \u10E8\u10D4\u10EA\u10D3\u10DD\u10DB\u10D0",
    invalidData: "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10DB\u10DD\u10DC\u10D0\u10EA\u10D4\u10DB\u10D4\u10D1\u10D8",
    userNotFound: "\u10DB\u10DD\u10DB\u10EE\u10DB\u10D0\u10E0\u10D4\u10D1\u10D4\u10DA\u10D8 \u10D5\u10D4\u10E0 \u10DB\u10DD\u10D8\u10EB\u10D4\u10D1\u10DC\u10D0"
  }
};
function getErrorMessage(req, key) {
  const acceptLanguage = req.headers["accept-language"] || "";
  let lang = "ru";
  if (acceptLanguage.includes("en")) {
    lang = "en";
  } else if (acceptLanguage.includes("ka")) {
    lang = "ka";
  }
  return errorMessages[lang][key];
}
async function registerRoutes(app2) {
  app2.use(createSessionMiddleware());
  const httpServer = createServer(app2);
  const io2 = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  setSocketIO(io2);
  app2.post("/api/auth/validate-username", async (req, res) => {
    try {
      const { username } = z.object({
        username: z.string().min(3, "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 3 \u0441\u0438\u043C\u0432\u043E\u043B\u0430")
      }).parse(req.body);
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.json({ valid: false, message: "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442\u043E" });
      }
      res.json({ valid: true, message: "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E" });
    } catch (error) {
      if (error.errors) {
        return res.json({ valid: false, message: error.errors[0].message });
      }
      res.json({ valid: false, message: "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
    }
  });
  app2.post("/api/auth/validate-email", async (req, res) => {
    try {
      const { email } = z.object({
        email: z.string().email("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email")
      }).parse(req.body);
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.json({ valid: false, message: "Email \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D" });
      }
      res.json({ valid: true, message: "Email \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D" });
    } catch (error) {
      if (error.errors) {
        return res.json({ valid: false, message: error.errors[0].message });
      }
      res.json({ valid: false, message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email" });
    }
  });
  app2.post("/api/auth/validate-phone", async (req, res) => {
    try {
      const { phone } = z.object({
        phone: z.string().regex(/^\+996\d{9}$/, "\u041D\u043E\u043C\u0435\u0440 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 +996XXXXXXXXX")
      }).parse(req.body);
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.json({ valid: false, message: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D" });
      }
      res.json({ valid: true, message: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D" });
    } catch (error) {
      if (error.errors) {
        return res.json({ valid: false, message: error.errors[0].message });
      }
      res.json({ valid: false, message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u043D\u043E\u043C\u0435\u0440\u0430" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const registerData = z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        username: z.string().min(3, "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 3 \u0441\u0438\u043C\u0432\u043E\u043B\u0430"),
        email: z.string().email("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email"),
        phone: z.string().regex(/^\+996\d{9}$/, "\u041D\u043E\u043C\u0435\u0440 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 +996XXXXXXXXX"),
        password: z.string().min(6, "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"),
        dateOfBirth: z.string().min(1, "\u0414\u0430\u0442\u0430 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u0430"),
        gender: z.enum(["male", "female", "other"], { required_error: "\u041F\u043E\u043B \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" })
      }).parse(req.body);
      const existingUsername = await storage.getUserByUsername(registerData.username);
      if (existingUsername) {
        return res.status(400).json({ error: getErrorMessage(req, "userAlreadyExists") });
      }
      const existingEmail = await storage.getUserByEmail(registerData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D" });
      }
      const existingPhone = await storage.getUserByPhone(registerData.phone);
      if (existingPhone) {
        return res.status(400).json({ error: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D" });
      }
      const birthDate = new Date(registerData.dateOfBirth);
      const today = /* @__PURE__ */ new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate() ? age - 1 : age;
      if (actualAge < 18) {
        return res.status(400).json({ error: "\u0412\u0430\u043C \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 18 \u043B\u0435\u0442 \u0434\u043B\u044F \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438" });
      }
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection?.socket?.remoteAddress;
      const user = await storage.createUser({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        username: registerData.username,
        email: registerData.email,
        phone: registerData.phone,
        password: hashedPassword,
        dateOfBirth: new Date(registerData.dateOfBirth),
        gender: registerData.gender,
        bidBalance: 5,
        // Starting bid balance
        role: "user",
        ipAddress
      });
      req.session.userId = user.id;
      req.session.userRole = user.role;
      res.json({ user: { id: user.id, username: user.username, bidBalance: user.bidBalance, role: user.role } });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: getErrorMessage(req, "registrationError") });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);
      const user = await storage.getUserByUsername(username);
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: getErrorMessage(req, "invalidCredentials") });
      }
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection?.socket?.remoteAddress;
      await storage.updateUserIpAddress(user.id, ipAddress);
      req.session.userId = user.id;
      req.session.userRole = user.role;
      res.json({ user: { id: user.id, username: user.username, bidBalance: user.bidBalance, role: user.role } });
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(req, "invalidData") });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    console.log("User ID from session:", req.session.userId);
    if (!req.session.userId) {
      return res.status(401).json({ error: getErrorMessage(req, "unauthorized") });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: getErrorMessage(req, "userNotFound") });
    }
    res.json({ user: { id: user.id, username: user.username, bidBalance: user.bidBalance, role: user.role } });
  });
  app2.get("/api/auctions", async (req, res) => {
    const { status } = req.query;
    if (status && typeof status === "string") {
      const auctions2 = await storage.getAuctionsByStatus(status);
      return res.json(auctions2);
    }
    const upcoming = await storage.getAuctionsByStatus("upcoming");
    const live = await storage.getAuctionsByStatus("live");
    const allFinished = await storage.getAuctionsByStatus("finished");
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const finished = allFinished.filter((auction) => {
      if (!auction.endTime) return false;
      const endTime = new Date(auction.endTime);
      return endTime >= today && endTime < tomorrow;
    });
    const finishedWithBotWinners = await Promise.all(
      finished.map(async (auction) => {
        if (!auction.winnerId) {
          const lastBotBid = await storage.getLastBotBidForAuction(auction.id);
          if (lastBotBid && lastBotBid.botId) {
            const bot = await storage.getBot(lastBotBid.botId);
            if (bot) {
              return {
                ...auction,
                winner: {
                  id: bot.id,
                  username: bot.username,
                  firstName: bot.firstName,
                  lastName: bot.lastName
                }
              };
            }
          }
        }
        return auction;
      })
    );
    const upcomingWithPrebids = await Promise.all(
      upcoming.map(async (auction) => {
        const prebids2 = await storage.getPrebidsForAuction(auction.id);
        return {
          ...auction,
          prebidsCount: prebids2.length
        };
      })
    );
    res.json({ upcoming: upcomingWithPrebids, live, finished: finishedWithBotWinners });
  });
  app2.get("/api/auctions/:id", async (req, res) => {
    const auction = await storage.getAuction(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: "\u0410\u0443\u043A\u0446\u0438\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
    }
    res.json(auction);
  });
  app2.get("/api/auctions/slug/:slug", async (req, res) => {
    const allAuctions = await storage.getAllAuctions();
    const createSlug = (title, displayId) => {
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9а-я\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim().substring(0, 35);
      const cleanDisplayId = displayId.replace(/[/\\]/g, "-").toLowerCase();
      return `${baseSlug}-${cleanDisplayId}`;
    };
    const auction = allAuctions.find((a) => createSlug(a.title, a.displayId) === req.params.slug);
    if (!auction) {
      return res.status(404).json({ error: "\u0410\u0443\u043A\u0446\u0438\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
    }
    res.json(auction);
  });
  app2.post("/api/auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const auctionData = insertAuctionSchema.parse(req.body);
      const auction = await storage.createAuction(auctionData);
      res.json(auction);
    } catch (error) {
      res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u0430" });
    }
  });
  app2.post("/api/auctions/:id/bid", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const success = await auctionService.placeBid(req.params.id, req.session.userId);
    if (!success) {
      return res.status(400).json({ error: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u0442\u0430\u0432\u043A\u0443" });
    }
    const auction = await storage.getAuction(req.params.id);
    const bids2 = await storage.getBidsForAuction(req.params.id);
    const timers = timerService.getAllTimers();
    io2.emit("auctionUpdate", { auction, bids: bids2.slice(0, 5), timers });
    res.json({ success: true });
  });
  app2.post("/api/auctions/:id/prebid", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const result = await auctionService.placePrebid(req.params.id, req.session.userId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true });
  });
  app2.get("/api/bids/recent", async (req, res) => {
    const bids2 = await storage.getRecentBids(20);
    res.json(bids2);
  });
  app2.get("/api/bids/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const bids2 = await storage.getUserBids(req.session.userId, 50);
    res.json(bids2);
  });
  app2.get("/api/prebids/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const prebids2 = await storage.getUserPrebids(req.session.userId, 50);
    res.json(prebids2);
  });
  app2.get("/api/auctions/:id/bids", async (req, res) => {
    const bids2 = await storage.getBidsForAuction(req.params.id);
    res.json(bids2);
  });
  app2.get("/api/auctions/slug/:slug/bids", async (req, res) => {
    const allAuctions = await storage.getAllAuctions();
    const createSlug = (title, displayId) => {
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9а-я\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim().substring(0, 35);
      const cleanDisplayId = displayId.replace(/[/\\]/g, "-").toLowerCase();
      return `${baseSlug}-${cleanDisplayId}`;
    };
    const auction = allAuctions.find((a) => createSlug(a.title, a.displayId) === req.params.slug);
    if (!auction) {
      return res.status(404).json({ error: "\u0410\u0443\u043A\u0446\u0438\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
    }
    const bids2 = await storage.getBidsForAuction(auction.id);
    res.json(bids2);
  });
  app2.get("/api/auctions/:id/stats", async (req, res) => {
    const allBids = await storage.getBidsForAuction(req.params.id);
    const actualBids = allBids.filter((bid) => !bid.isPrebid);
    const uniqueParticipants = new Set(actualBids.map((bid) => bid.isBot ? bid.botName : bid.user?.username)).size;
    const auction = await storage.getAuction(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: "\u0410\u0443\u043A\u0446\u0438\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
    }
    const stats = {
      totalBids: actualBids.length,
      // Only count actual bids for numbering
      uniqueParticipants,
      priceIncrease: parseFloat(auction.currentPrice).toFixed(2)
    };
    res.json(stats);
  });
  app2.get("/api/auctions/:id/bots", async (req, res) => {
    const auctionBots2 = await botService.getAuctionBots(req.params.id);
    res.json(auctionBots2);
  });
  app2.get("/api/auctions/slug/:slug/stats", async (req, res) => {
    const allAuctions = await storage.getAllAuctions();
    const createSlug = (title, displayId) => {
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9а-я\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim().substring(0, 35);
      const cleanDisplayId = displayId.replace(/[/\\]/g, "-").toLowerCase();
      return `${baseSlug}-${cleanDisplayId}`;
    };
    const auction = allAuctions.find((a) => createSlug(a.title, a.displayId) === req.params.slug);
    if (!auction) {
      return res.status(404).json({ error: "\u0410\u0443\u043A\u0446\u0438\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
    }
    const allBids = await storage.getBidsForAuction(auction.id);
    const uniqueParticipants = new Set(allBids.map((bid) => bid.isBot ? bid.botName : bid.user?.username)).size;
    const stats = {
      totalBids: allBids.length,
      uniqueParticipants,
      priceIncrease: parseFloat(auction.currentPrice).toFixed(2)
    };
    res.json(stats);
  });
  app2.get("/api/users/stats", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const stats = await storage.getUserStats(req.session.userId);
    res.json(stats);
  });
  app2.get("/api/users/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
    }
    res.json(user);
  });
  app2.put("/api/users/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    try {
      const inputData = z.object({
        firstName: z.string().min(2, "\u0418\u043C\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0430"),
        lastName: z.string().min(2, "\u0424\u0430\u043C\u0438\u043B\u0438\u044F \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0430"),
        email: z.string().email("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email").optional(),
        phone: z.string().regex(/^\+996\d{9}$/, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u043C\u0435\u0440 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 +996XXXXXXXXX").optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional()
      }).parse(req.body);
      const updateData = {
        ...inputData,
        dateOfBirth: inputData.dateOfBirth ? new Date(inputData.dateOfBirth) : void 0
      };
      const updatedUser = await storage.updateUser(req.session.userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435" });
    }
  });
  app2.get("/api/users/won-auctions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const wonAuctions = await storage.getUserWonAuctions(req.session.userId);
    res.json(wonAuctions);
  });
  app2.get("/api/users/recent-bids", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "\u041D\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D" });
    }
    const recentBids = await storage.getUserRecentBids(req.session.userId);
    res.json(recentBids);
  });
  app2.get("/api/admin/bot-settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    const settings2 = await storage.getBotSettings();
    res.json(settings2);
  });
  app2.put("/api/admin/bot-settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const settings2 = await storage.updateBotSettings(req.body);
      res.json(settings2);
    } catch (error) {
      res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" });
    }
  });
  app2.get("/api/admin/auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    const auctions2 = await storage.getAllAuctions();
    res.json(auctions2);
  });
  app2.get("/api/admin/finished-auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    const finishedAuctions = await storage.getAuctionsByStatus("finished");
    const finishedWithBotWinners = await Promise.all(
      finishedAuctions.map(async (auction) => {
        if (!auction.winnerId) {
          const lastBotBid = await storage.getLastBotBidForAuction(auction.id);
          if (lastBotBid && lastBotBid.botId) {
            const bot = await storage.getBot(lastBotBid.botId);
            if (bot) {
              return {
                ...auction,
                winner: {
                  id: bot.id,
                  username: bot.username,
                  firstName: bot.firstName,
                  lastName: bot.lastName
                }
              };
            }
          }
        }
        return auction;
      })
    );
    res.json(finishedWithBotWinners);
  });
  app2.get("/api/admin/auction-stats/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const stats = await storage.getAuctionDetailedStats(req.params.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching auction stats:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u0430" });
    }
  });
  app2.delete("/api/admin/auctions/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      console.log("Attempting to delete auction:", req.params.id);
      await storage.deleteAuction(req.params.id);
      console.log("Successfully deleted auction:", req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting auction:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u0430" });
    }
  });
  app2.post("/api/admin/auctions", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      console.log("Received auction data:", req.body);
      const processedData = {
        ...req.body,
        retailPrice: req.body.retailPrice?.toString() || "0",
        startTime: new Date(req.body.startTime)
      };
      const auctionData = insertAuctionSchema.parse(processedData);
      console.log("Parsed auction data:", auctionData);
      const auction = await storage.createAuction(auctionData);
      res.json(auction);
    } catch (error) {
      console.error("Auction validation error:", error);
      res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u0430" });
    }
  });
  app2.put("/api/admin/auctions/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const processedData = { ...req.body };
      if (req.body.retailPrice !== void 0) {
        processedData.retailPrice = req.body.retailPrice?.toString() || "0";
      }
      if (req.body.startTime !== void 0) {
        processedData.startTime = new Date(req.body.startTime);
      }
      const auctionData = insertAuctionSchema.partial().parse(processedData);
      const auction = await storage.updateAuction(req.params.id, auctionData);
      res.json(auction);
    } catch (error) {
      console.error("Auction update validation error:", error);
      res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u0430" });
    }
  });
  app2.delete("/api/admin/auctions/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      console.log("Attempting to delete auction:", req.params.id);
      await storage.deleteAuction(req.params.id);
      console.log("Successfully deleted auction:", req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting auction:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u0430" });
    }
  });
  app2.post("/api/admin/auctions/:id/start", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      await auctionService.startAuction(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error starting auction:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u043F\u0443\u0441\u043A\u0435 \u0430\u0443\u043A\u0446\u0438\u043E\u043D\u0430" });
    }
  });
  app2.post("/api/admin/auctions/:id/end", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    await auctionService.endAuction(req.params.id);
    res.json({ success: true });
  });
  app2.get("/api/admin/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    const bots2 = await botService.getAllBots();
    res.json(bots2);
  });
  app2.post("/api/admin/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const botData = insertBotSchema.parse(req.body);
      const bot = await botService.createBot(botData);
      res.json(bot);
    } catch (error) {
      console.error("Bot creation error:", error);
      res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0431\u043E\u0442\u0430" });
    }
  });
  app2.put("/api/admin/bots/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const botData = insertBotSchema.partial().parse(req.body);
      const bot = await botService.updateBot(req.params.id, botData);
      res.json(bot);
    } catch (error) {
      console.error("Bot update error:", error);
      res.status(400).json({ error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0431\u043E\u0442\u0430" });
    }
  });
  app2.delete("/api/admin/bots/:id", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    await botService.deleteBot(req.params.id);
    res.json({ success: true });
  });
  app2.get("/api/admin/auctions/:auctionId/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    const auctionBots2 = await botService.getAuctionBots(req.params.auctionId);
    res.json(auctionBots2);
  });
  app2.post("/api/admin/auctions/:auctionId/bots", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    const { botId, bidLimit = 0 } = req.body;
    await botService.addBotToAuction(req.params.auctionId, botId, bidLimit);
    res.json({ success: true });
  });
  app2.delete("/api/admin/auctions/:auctionId/bots/:botId", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    await botService.removeBotFromAuction(req.params.auctionId, req.params.botId);
    res.json({ success: true });
  });
  app2.get("/api/admin/bots/auction-status", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const botsWithStatus = await botService.getBotsWithAuctionStatus();
      res.json(botsWithStatus);
    } catch (error) {
      console.error("Error fetching bots with auction status:", error);
      res.status(500).json({ error: "Failed to fetch bots with auction status" });
    }
  });
  app2.get("/api/admin/users", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      console.log("Fetching users with params:", { page, limit, search });
      const users2 = await storage.getUsersWithStats(page, limit, search);
      console.log("Users fetched with stats:", JSON.stringify(users2, null, 2));
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439" });
    }
  });
  app2.get("/api/admin/users/today-registrations", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const todayCount = await storage.getTodayRegistrations();
      res.json({ count: todayCount });
    } catch (error) {
      console.error("Error fetching today's registrations:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F\u0445" });
    }
  });
  app2.get("/api/admin/users/:id/activity", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const userId = req.params.id;
      const activity = await storage.getUserAuctionActivity(userId);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
    }
  });
  app2.patch("/api/admin/users/:userId", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const userId = req.params.userId;
      const updateData = z.object({
        username: z.string().min(3).optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        balance: z.number().optional(),
        role: z.enum(["user", "admin"]).optional()
      }).parse(req.body);
      const updatedUser = await storage.updateUser(userId, updateData);
      res.json({ user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
    }
  });
  app2.delete("/api/admin/users/:userId", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const userId = req.params.userId;
      if (userId === req.session.userId) {
        return res.status(400).json({ error: "\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442" });
      }
      await storage.deleteUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" });
    }
  });
  app2.get("/api/admin/settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const settings2 = await storage.getSettings();
      res.json(settings2);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A" });
    }
  });
  app2.put("/api/admin/settings", async (req, res) => {
    if (req.session.userRole !== "admin") {
      return res.status(403).json({ error: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D" });
    }
    try {
      const updateData = insertSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateSettings(updateData);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A" });
    }
  });
  app2.get("/api/settings", async (req, res) => {
    try {
      const settings2 = await storage.getSettings();
      res.json(settings2);
    } catch (error) {
      console.error("Error fetching public settings:", error);
      res.status(500).json({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A" });
    }
  });
  app2.get("/api/timers", (req, res) => {
    const timers = timerService.getAllTimers();
    res.json(timers);
  });
  io2.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("joinAuction", (auctionId) => {
      socket.join(`auction-${auctionId}`);
    });
    socket.on("leaveAuction", (auctionId) => {
      socket.leave(`auction-${auctionId}`);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  setInterval(async () => {
    const timers = timerService.getAllTimers();
    io2.emit("timerUpdate", timers);
    try {
      const liveAuctions = await storage.getAuctionsByStatus("live");
      for (const auction of liveAuctions) {
        const bids2 = await storage.getBidsForAuction(auction.id);
        io2.emit("auctionUpdate", {
          auction,
          bids: bids2.slice(0, 5),
          timers
        });
      }
    } catch (error) {
      console.error("Error in periodic auction updates:", error);
    }
    await auctionService.checkUpcomingAuctions();
  }, 1e3);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath2 } from "url";
var __dirname2 = path2.dirname(fileURLToPath2(import.meta.url));
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(__dirname2, "..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_auction_service();
process.env.TZ = "Asia/Bishkek";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, async () => {
    log(`serving on port ${port}`);
    await auctionService.restartLiveAuctions();
  });
})();
