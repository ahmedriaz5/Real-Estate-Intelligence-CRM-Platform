"""create customers

Revision ID: 001_create_customers
Revises:
Create Date: 2026-09-05
"""

from alembic import op
import sqlalchemy as sa


revision = "001_create_customers"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    op.create_table(
        "customers",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
        ),

        sa.Column(
            "full_name",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "email",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "phone",
            sa.String(length=30),
            nullable=True,
        ),

        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("true"),
            nullable=False,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.UniqueConstraint(
            "email",
            name="uq_customers_email",
        ),
    )

    op.create_index(
        "ix_customers_id",
        "customers",
        ["id"],
    )

    op.create_index(
        "ix_customers_email",
        "customers",
        ["email"],
    )


def downgrade():

    op.drop_index(
        "ix_customers_email",
        table_name="customers",
    )

    op.drop_index(
        "ix_customers_id",
        table_name="customers",
    )

    op.drop_table("customers")