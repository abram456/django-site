# Generated by Django 2.1.5 on 2019-02-25 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page', '0003_auto_20190225_1243'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='is_active',
            field=models.BooleanField(blank=True),
        ),
        migrations.AlterField(
            model_name='page',
            name='is_deleted',
            field=models.BooleanField(blank=True),
        ),
    ]