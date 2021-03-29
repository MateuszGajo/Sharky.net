using System.Collections.Generic;
using System.Linq;
using Domain;

namespace Persistence
{
    public class Seed
    {
        public static void SeedData(DataBaseContext context)
        {
            if (!context.Users.Any())
            {
                var Users = new List<User>{
                    new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},
                    new User {Email="ruslav2@ruslav2.pl",FirstName="Tom",LastName="Musk", UserName="ruslavruslav15"}
                };

                context.AddRange(Users);
                context.SaveChanges();
            }
        }
    }
}