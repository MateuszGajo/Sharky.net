using System;
using System.Threading.Tasks;
using API.Middleware;
using Application.Interface;
using Application.Users;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Persistence;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Application.Core;
using Microsoft.EntityFrameworkCore.Diagnostics;
using API.SignalR;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataBaseContext>(opt =>
            {
                opt.ConfigureWarnings(x => x.Ignore(CoreEventId.RowLimitingOperationWithoutOrderByWarning));
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
                opt.UseSqlite(c => c.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
            });

            services.AddMediatR(typeof(Details.Handler).Assembly);
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            }).AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                )
            .AddFluentValidation(cfg =>
            {
                cfg.RegisterValidatorsFromAssemblyContaining<Register>();
            });

            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));

            services.AddIdentityCore<User>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataBaseContext>()
            .AddSignInManager<SignInManager<User>>();
            // .AddDefaultTokenProviders(); 

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }
            )
                   .AddJwtBearer(options =>
                   {
                       options.TokenValidationParameters = new TokenValidationParameters
                       {
                           ValidateIssuerSigningKey = true,
                           IssuerSigningKey = key,
                           ValidateAudience = false,
                           ValidateIssuer = false,
                           ValidateLifetime = true,
                           ClockSkew = TimeSpan.Zero
                       };

                       options.Events = new JwtBearerEvents
                       {
                           OnMessageReceived = context =>
                           {
                               context.Token = context.Request.Cookies["Token"];
                               return Task.CompletedTask;
                           }
                       };
                   });
            services.AddSignalR();

            services.AddCors(opt =>
            {
                opt.AddPolicy("myPolicy", builder =>
                {
                    builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
                });
            });

            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                c.CustomSchemaIds(type => type.ToString());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("myPolicy");
            app.UseAuthentication();


            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<CommonHub>("/commonHub");
            });
        }
    }
}
