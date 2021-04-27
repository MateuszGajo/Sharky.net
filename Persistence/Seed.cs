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
                    new User {Id = "adebacba-4986-44c4-b4eb-0c66afda9d7b",Email="example@example.com",FirstName="Bob",LastName="Smith", UserName="bobsmith1"},
                    new User {Id ="80f1dab6-7aa0-4693-98c3-232e6aec16bb",Email="example1@example1.com",FirstName="Tom",LastName="Musk", UserName="tommusk1"},
                    new User {Id ="06228c34-9c71-4c68-9493-ab13e0a30bd4",Email="example2@example2.com",FirstName="John",LastName="John", UserName="johnjohn1"},
                    new User {Id ="32257ce4-7c32-48a9-ab16-9e4be1633cdb",Email="example3@example3.com",FirstName="Harry",LastName="Brown", UserName="harrybrown1"},
                    new User {Id ="a997f083-7dab-45de-b45d-224520a2a29f",Email="example3@example3.com",FirstName="Charlie",LastName="William", UserName="charliewilliam1"},
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (!context.Friends.Any())
            {
                var bob = await context.Users.FindAsync("adebacba-4986-44c4-b4eb-0c66afda9d7b");
                var tom = await context.Users.FindAsync("80f1dab6-7aa0-4693-98c3-232e6aec16bb");
                var john = await context.Users.FindAsync("06228c34-9c71-4c68-9493-ab13e0a30bd4");
                var harry = await context.Users.FindAsync("32257ce4-7c32-48a9-ab16-9e4be1633cdb");
                var charlie = await context.Users.FindAsync("a997f083-7dab-45de-b45d-224520a2a29f");

                Friend friendshipBobTom = new Friend
                {
                    RequestedBy = bob,
                    RequestedTo = tom,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved
                };

                Friend friendshipBobJohn = new Friend
                {
                    RequestedBy = john,
                    RequestedTo = bob,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved
                };

                Friend friendshipJohnHarry = new Friend
                {
                    RequestedBy = harry,
                    RequestedTo = john,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved
                };


                Friend friendshipTomHarry = new Friend
                {
                    RequestedBy = tom,
                    RequestedTo = harry,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved
                };

                Friend friendshipTomJohn = new Friend
                {
                    RequestedBy = tom,
                    RequestedTo = john,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved
                };


                Friend friendshipTomCharlie = new Friend
                {
                    RequestedBy = tom,
                    RequestedTo = charlie,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved
                };


                List<Friend> friendss = new List<Friend>(){
                        friendshipBobJohn,
                        friendshipBobTom,
                        friendshipJohnHarry,
                        friendshipTomCharlie,
                        friendshipTomHarry,
                        friendshipTomJohn
                };

                context.AddRange(friendss);
                await context.SaveChangesAsync();
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