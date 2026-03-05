from django import template
from core.decorators import tier_has_feature

register = template.Library()


@register.simple_tag(takes_context=True)
def if_tier(context, *tiers):
    org_tier = context.get("user_profile") and context["user_profile"].organization.tier or "free"
    return org_tier.lower() in [t.lower() for t in tiers]


@register.simple_tag(takes_context=True)
def has_feature(context, feature):
    org_tier = context.get("user_profile") and context["user_profile"].organization.tier or "free"
    return tier_has_feature(org_tier, feature)
