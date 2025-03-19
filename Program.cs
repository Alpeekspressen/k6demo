var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", async (HttpContext context) =>
{
    await HandleRequest(context);
});

app.MapGet("/health", () => "Running");

app.Run();

async Task HandleRequest(HttpContext context)
{
    if (context.Request.Query.TryGetValue("sleep", out var sleepValue))
    {
        if (int.TryParse(sleepValue, out int sleepTime))
        {
            sleepTime = Math.Min(sleepTime, 500); // Ensure sleep time is at most 500 ms
            await Task.Delay(sleepTime);
        }
    }
    await context.Response.WriteAsync("Hello K6!");
}
