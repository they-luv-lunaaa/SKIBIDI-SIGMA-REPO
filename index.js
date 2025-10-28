import discord
from discord.ext import commands

# Enable intents so the bot can read messages
intents = discord.Intents.default()
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Logged in as {bot.user}")

@bot.command()
@commands.has_permissions(manage_messages=True)
async def purge(ctx):
    """Deletes all messages in this channel that don't have images or attachments."""
    await ctx.send("🔍 Scanning for messages without images...")

    deleted = 0
    async for msg in ctx.channel.history(limit=None):
        has_image = False

        # Check for attachments (uploaded images, files, etc.)
        if msg.attachments:
            has_image = True
        else:
            # Also check if message content includes an image URL
            if any(msg.content.lower().endswith(ext) for ext in (".png", ".jpg", ".jpeg", ".gif", ".webp")):
                has_image = True

        if not has_image:
            try:
                await msg.delete()
                deleted += 1
            except discord.errors.Forbidden:
                await ctx.send("⚠️ Missing permissions to delete some messages.")
                break
            except discord.errors.HTTPException:
                continue  # skip failed deletions (rate limits, etc.)

    await ctx.send(f"✅ Purge complete. Deleted {deleted} text-only messages.")

bot.run("YOUR_BOT_TOKEN_HERE")
