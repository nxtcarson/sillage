from django import template
from core.decorators import tier_has_feature

register = template.Library()


def _org_tier(context):
    req = context.get("request")
    org = getattr(req, "current_org", None) if req else None
    if not org and context.get("user_profile"):
        org = context["user_profile"].organization
    return org.tier if org else "free"


@register.simple_tag(takes_context=True)
def if_tier(context, *tiers):
    return _org_tier(context).lower() in [t.lower() for t in tiers]


@register.simple_tag(takes_context=True)
def has_feature(context, feature):
    return tier_has_feature(_org_tier(context), feature)
