#!/usr/bin/env python3
"""
Check escalation system - see what submissions exist and their statuses
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def check_escalations():
    """Check what submissions exist and their escalation status"""
    
    print("=" * 70)
    print("ESCALATION SYSTEM CHECK")
    print("=" * 70)
    
    try:
        from database import get_db
        from models import Submission, Tally, Vote
        from sqlalchemy import select, func
        
        async for db in get_db():
            # Check all submissions
            print("\n1. All submissions in database:")
            result = await db.execute(
                select(Submission.id, Submission.genre, Submission.status, 
                       Submission.created_at, Submission.content_ref)
                .order_by(Submission.id)
            )
            submissions = result.all()
            
            if not submissions:
                print("   ❌ No submissions found in database")
                return
            
            print(f"   Found {len(submissions)} submissions:")
            for sub in submissions:
                print(f"   - ID {sub.id}: {sub.genre} | Status: {sub.status} | Created: {sub.created_at}")
                if sub.content_ref:
                    print(f"     Content: {sub.content_ref[:50]}...")
            
            # Check tallies
            print(f"\n2. Tallies for submissions:")
            result = await db.execute(
                select(Tally.submission_id, Tally.count_approve, Tally.count_reject, 
                       Tally.count_escalate, Tally.count_flag, Tally.final_decision)
                .order_by(Tally.submission_id)
            )
            tallies = result.all()
            
            if tallies:
                print(f"   Found {len(tallies)} tallies:")
                for tally in tallies:
                    print(f"   - Submission {tally.submission_id}: "
                          f"Approve={tally.count_approve}, Reject={tally.count_reject}, "
                          f"Escalate={tally.count_escalate}, Flag={tally.count_flag} "
                          f"→ Decision: {tally.final_decision}")
            else:
                print("   ❌ No tallies found")
            
            # Check votes
            print(f"\n3. Votes cast:")
            result = await db.execute(
                select(Vote.submission_id, Vote.vote_type, func.count(Vote.id))
                .group_by(Vote.submission_id, Vote.vote_type)
                .order_by(Vote.submission_id, Vote.vote_type)
            )
            votes = result.all()
            
            if votes:
                print(f"   Found votes:")
                current_sub = None
                for vote in votes:
                    if vote.submission_id != current_sub:
                        current_sub = vote.submission_id
                        print(f"   - Submission {vote.submission_id}:")
                    print(f"     {vote.vote_type}: {vote[2]} votes")
            else:
                print("   ❌ No votes found")
            
            # Check specifically for escalated submissions
            print(f"\n4. Escalated submissions (what admin should see):")
            result = await db.execute(
                select(Submission)
                .where(Submission.status == "escalated")
                .order_by(Submission.created_at.desc())
            )
            escalated = result.scalars().all()
            
            if escalated:
                print(f"   ✅ Found {len(escalated)} escalated submissions:")
                for sub in escalated:
                    print(f"   - ID {sub.id}: {sub.genre} | Created: {sub.created_at}")
                    print(f"     Content: {sub.content_ref[:50] if sub.content_ref else 'No content'}...")
            else:
                print("   ❌ No escalated submissions found")
                print("   This is why admin doesn't see any escalated content!")
            
            # Check flagged submissions too
            print(f"\n5. Flagged submissions:")
            result = await db.execute(
                select(Submission)
                .where(Submission.status == "flagged")
                .order_by(Submission.created_at.desc())
            )
            flagged = result.scalars().all()
            
            if flagged:
                print(f"   ✅ Found {len(flagged)} flagged submissions:")
                for sub in flagged:
                    print(f"   - ID {sub.id}: {sub.genre} | Created: {sub.created_at}")
            else:
                print("   ❌ No flagged submissions found")
            
            break
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_escalations())
