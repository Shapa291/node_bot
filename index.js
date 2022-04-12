const { Telegraf, Markup } = require("telegraf");
require("dotenv").config(); //Подключаем внешний файл и сразу его исполняем

const bot = new Telegraf(process.env.BOT_TOKEN);
const helpCommands = require("./const");

bot.start((ctx) => {
  console.log(ctx.message.from);
  ctx.reply(
    `Привет ${
      ctx.message.from.first_name
        ? "@" + ctx.message.from.username
        : "незнакомец"
    }`
  );
});
bot.help((ctx) => ctx.reply(helpCommands.commands));

bot.command("course", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "<b>Курсы</b>",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Редакторы", "btn_1"),
          Markup.button.callback("Обзоры", "btn_2"),
          Markup.button.callback("JS", "btn_3"),
        ],
        [Markup.button.callback("Rust", "btn_4")],
      ])
    );

    await ctx.reply("Спасибо что выбрали нас");
  } catch (e) {
    console.error(e);
  }
});

function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src !== false) {
        await ctx.replyWithPhoto({
          source: src,
        });
      }
      await ctx.replyWithHTML(text, {
        disable_web_page_preview: true,
      });
    } catch (e) {
      console.error(e);
    }
  });
}

addActionBot("btn_1", "./img/1.jpeg", helpCommands.text1);
addActionBot("btn_2", "./img/2.jpeg", helpCommands.text2);
addActionBot("btn_3", false, helpCommands.text3);
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
