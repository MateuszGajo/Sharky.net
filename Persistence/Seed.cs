using System.Collections.Generic;
using System.Linq;
using Domain;

namespace Persistence
{
    public class Seed
    {
          public static void SeedData(DataBaseContext context)
        {
            if(!context.Users.Any()){
                var Users  = new List<User>{
                    new User {Firstname="Bob",Lastname="smith"}
                };

                context.AddRange(Users);
                context.SaveChanges();
            }
        }
    }
}