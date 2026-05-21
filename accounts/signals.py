from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if not created or not instance.email:
        return
    from accounts.models import UserProfile
    UserProfile.objects.get_or_create(
        email=instance.email,
        defaults={
            "password": instance.password,
            "name": (instance.get_full_name() or "").strip(),
        },
    )
