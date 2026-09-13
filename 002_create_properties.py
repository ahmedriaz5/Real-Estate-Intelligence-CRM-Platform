"""create properties

Revision ID: 002_create_properties
Revises: 001_create_customers
"""

from alembic import op
import sqlalchemy as sa


revision = "002_create_properties"
down_revision = "001_create_customers"
branch_labels = None
depends_on = None


def upgrade():

    op.create_table(
        "properties",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
        ),

        sa.Column(
            "title",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "city",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "address",
            sa.String(length=500),
            nullable=False,
        ),

        sa.Column(
            "price",
            sa.Numeric(14, 2),
            nullable=False,
        ),

        sa.Column(
            "bedrooms",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "property_type",
            sa.String(length=50),
            nullable=False,
        ),

        sa.Column(
            "is_available",
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
    )

    op.create_index(
        "ix_properties_id",
        "properties",
        ["id"],
    )

    op.create_index(
        "ix_properties_city",
        "properties",
        ["city"],
    )


def downgrade():

    op.drop_index(
        "ix_properties_city",
        table_name="properties",
    )

    op.drop_index(
        "ix_properties_id",
        table_name="properties",
    )

    op.drop_table("properties")