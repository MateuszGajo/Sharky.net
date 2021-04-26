using System;
using System.Collections.Generic;
using System.Linq;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async void SeedData(DataBaseContext context, UserManager<User> userManager)
        {
            if (!context.Users.Any())
            {
                var users = new List<User>{
                    new User {Id = "adebacba-4986-44c4-b4eb-0c66afda9d7b",Email="example@example.com",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},
                    new User {Id ="80f1dab6-7aa0-4693-98c3-232e6aec16bb",Email="example1@example1.com",FirstName="Tom",LastName="Musk", UserName="ruslavruslav15"}
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }


            // if (!context.Activities.Any())
            // {
            //     var Users = new List<Activity>{
            //         new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="aaa",Photo=new Photo{Id ="h0d8jviej44ym5sfuucg",Url="https://res.cloudinary.com/dqcup3ujq/image/upload/v1617127216/h0d8jviej44ym5sfuucg.jpg"},CreatedAt=DateTime.Now.AddDays(-80)},
            //         new Activity{Id = Guid.Parse("75bcf57f-d5f0-47df-ac0b-46e5a85dbcd7"), User=new User {Id= "c48bb30f-130e-4211-8c51-69e8241cb7d7", Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="bbczxce323e21b",Photo=null,CreatedAt=DateTime.Now.AddDays(-40)},
            //         new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-20)},
            //         new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ddd",Photo=null,CreatedAt=DateTime.Now},
            //         new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-30)},
            //         new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-2)},
            //         new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-150)},
            //     };
            //     var user = context.Users.Find("80f1dab6-7aa0-4693-98c3-232e6aec16bb");
            //     for (int i = 0; i < 1000; i++)
            //     {

            //         var activity = new Activity { Id = Guid.NewGuid(), User = user, Content = "ddd", Photo = null, CreatedAt = DateTime.Now };

            //         var comments = new List<Comment>();
            //         for (int j = 0; j < 1; j++)
            //         {
            //             var comment = new Comment { Id = Guid.NewGuid(), Content = "lorem ipsu lorem ipsu lorem ipsu", Author = user, CreatedAt = DateTime.Now };
            //             activity.CommentsCount += 1;
            //             var replies = new List<Reply>();
            //             comments.Add(comment);
            //             for (int k = 0; k < 1; k++)
            //             {
            //                 var reply = new Reply { Id = Guid.NewGuid(), Content = "lorem ipsu lorem ipsu lorem ipsu", Author = user, CreatedAt = DateTime.Now };
            //                 replies.Add(reply);
            //                 comment.RepliesCount += 1;
            //             }
            //             comment.Replies = replies;

            //         }
            //         activity.Comments = comments;
            //         Users.Add(activity);
            //     }
            //     context.AddRange(Users);
            //     context.SaveChanges();
            // }


        }
    }
}