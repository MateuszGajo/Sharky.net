using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataBaseContext _context;
            private readonly IMapper _mapper;
            public Handler(DataBaseContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                AppActivity appActivity = await _context.AppActivity.Include(x => x.Activity).ThenInclude(x => x.User).FirstOrDefaultAsync(x => x.Id == request.Id);
                if (appActivity == null) throw new RestException(HttpStatusCode.NotFound, new { Activity = "Activity doesn't exist" });

                return _mapper.Map<ActivityDto>(appActivity);
            }
        }
    }
}