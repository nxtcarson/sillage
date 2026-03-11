def get_current_org(request):
    org = getattr(request, "current_org", None)
    if org:
        return org
    profile = getattr(request, "user_profile", None)
    if not profile:
        return None
    return getattr(profile, "organization", None)
