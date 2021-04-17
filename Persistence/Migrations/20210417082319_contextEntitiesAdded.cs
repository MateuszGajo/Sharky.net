using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class contextEntitiesAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HiddenComment_Comments_CommentId",
                table: "HiddenComment");

            migrationBuilder.DropForeignKey(
                name: "FK_HiddenComment_Users_UserId",
                table: "HiddenComment");

            migrationBuilder.DropForeignKey(
                name: "FK_HiddenReply_Replies_ReplyId",
                table: "HiddenReply");

            migrationBuilder.DropForeignKey(
                name: "FK_HiddenReply_Users_UserId",
                table: "HiddenReply");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HiddenReply",
                table: "HiddenReply");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HiddenComment",
                table: "HiddenComment");

            migrationBuilder.RenameTable(
                name: "HiddenReply",
                newName: "HiddenReplies");

            migrationBuilder.RenameTable(
                name: "HiddenComment",
                newName: "HiddenComments");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenReply_UserId",
                table: "HiddenReplies",
                newName: "IX_HiddenReplies_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenReply_ReplyId",
                table: "HiddenReplies",
                newName: "IX_HiddenReplies_ReplyId");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenComment_UserId",
                table: "HiddenComments",
                newName: "IX_HiddenComments_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenComment_CommentId",
                table: "HiddenComments",
                newName: "IX_HiddenComments_CommentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HiddenReplies",
                table: "HiddenReplies",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HiddenComments",
                table: "HiddenComments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenComments_Comments_CommentId",
                table: "HiddenComments",
                column: "CommentId",
                principalTable: "Comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenComments_Users_UserId",
                table: "HiddenComments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenReplies_Replies_ReplyId",
                table: "HiddenReplies",
                column: "ReplyId",
                principalTable: "Replies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenReplies_Users_UserId",
                table: "HiddenReplies",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HiddenComments_Comments_CommentId",
                table: "HiddenComments");

            migrationBuilder.DropForeignKey(
                name: "FK_HiddenComments_Users_UserId",
                table: "HiddenComments");

            migrationBuilder.DropForeignKey(
                name: "FK_HiddenReplies_Replies_ReplyId",
                table: "HiddenReplies");

            migrationBuilder.DropForeignKey(
                name: "FK_HiddenReplies_Users_UserId",
                table: "HiddenReplies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HiddenReplies",
                table: "HiddenReplies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HiddenComments",
                table: "HiddenComments");

            migrationBuilder.RenameTable(
                name: "HiddenReplies",
                newName: "HiddenReply");

            migrationBuilder.RenameTable(
                name: "HiddenComments",
                newName: "HiddenComment");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenReplies_UserId",
                table: "HiddenReply",
                newName: "IX_HiddenReply_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenReplies_ReplyId",
                table: "HiddenReply",
                newName: "IX_HiddenReply_ReplyId");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenComments_UserId",
                table: "HiddenComment",
                newName: "IX_HiddenComment_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_HiddenComments_CommentId",
                table: "HiddenComment",
                newName: "IX_HiddenComment_CommentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HiddenReply",
                table: "HiddenReply",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HiddenComment",
                table: "HiddenComment",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenComment_Comments_CommentId",
                table: "HiddenComment",
                column: "CommentId",
                principalTable: "Comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenComment_Users_UserId",
                table: "HiddenComment",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenReply_Replies_ReplyId",
                table: "HiddenReply",
                column: "ReplyId",
                principalTable: "Replies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HiddenReply_Users_UserId",
                table: "HiddenReply",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
