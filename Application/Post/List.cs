using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Post
{
    public class List
    {
        public class Query : IRequest<List<Domain.Post>> { }

        public class Handler : IRequestHandler<Query, List<Domain.Post>>
        {
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context)
            {
                _context = context;
            }

            public async Task<List<Domain.Post>> Handle(Query request, CancellationToken cancellationToken)
            {
                 return await _context.Posts.Include(x => x.Photo).Include(x => x.Likes).ToListAsync();
            }
        }
    }
}