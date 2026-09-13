"""create leads

Revision ID: 003_create_leads
Revises: 002_create_properties
"""

from alembic import op
import sqlalchemy as sa


revision = "003_create_leads"
down_revision = "002_create_properties"
branch_labels = None
depends_on = None


lead_status = sa.Enum(
    "new",
    "contacted",
    "qualified",
    "closed_won",
    "closed_lost",
    name="lead_status",
)


def upgrade():

    lead_status.create(
        op.get_bind(),
        checkfirst=True,
    )

    op.create_table(
        "leads",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
        ),

        sa.Column(
            "customer_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "property_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "agent_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "status",
            lead_status,
            nullable=False,
            server_default="new",
        ),

        sa.Column(
            "notes",
            sa.String(length=2000),
            nullable=True,
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

        sa.ForeignKeyConstraint(
            ["customer_id"],
            ["customers.id"],
            ondelete="RESTRICT",
        ),

        sa.ForeignKeyConstraint(
            ["property_id"],
            ["properties.id"],
            ondelete="SET NULL",
        ),
    )

    op.create_index(
        "ix_leads_id",
        "leads",
        ["id"],
    )

    op.create_index(
        "ix_leads_customer_id",
        "leads",
        ["customer_id"],
    )

    op.create_index(
        "ix_leads_property_id",
        "leads",
        ["property_id"],
    )

    op.create_index(
        "ix_leads_agent_id",
        "leads",
        ["agent_id"],
    )

    op.create_index(
        "ix_leads_status",
        "leads",
        ["status"],
    )


def downgrade():

    op.drop_index(
        "ix_leads_status",
        table_name="leads",
    )

    op.drop_index(
        "ix_leads_agent_id",
        table_name="leads",
    )

    op.drop_index(
        "ix_leads_property_id",
        table_name="leads",
    )

    op.drop_index(
        "ix_leads_customer_id",
        table_name="leads",
    )

    op.drop_index(
        "ix_leads_id",
        table_name="leads",
    )

    op.drop_table("leads")

    lead_status.drop(
        op.get_bind(),
        checkfirst=True,
    )